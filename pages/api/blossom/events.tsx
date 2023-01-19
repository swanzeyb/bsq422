import type { NextApiRequest, NextApiResponse } from 'next'
import assert from 'node:assert'
import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(timezone)
dayjs.tz.setDefault('America/Los_Angeles')

const { BLOSSOM_API_KEY, BLOSSOM_API_URL } = process.env

assert(BLOSSOM_API_KEY, 'BLOSSOM_API_KEY is not defined')
assert(BLOSSOM_API_URL, 'BLOSSOM_API_URL is not defined')

interface Day {
  dayNum: string,
  dayName: string,
  events: {
    hours: string,
    subject: string,
    description?: string
  }[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const events = await axios({
      method: 'GET',
      url: [
        BLOSSOM_API_URL,
        'events?filters%5B%24and%5D%5B0%5D%5BDate%5D%5B%24gte%5D=',
        dayjs().format('YYYY-MM-DD'),
      ].join(''),
      headers: {
        Authorization: `Bearer ${BLOSSOM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.data.data)

    const index: { [key: string]: Day } = {}
    for (const event of events) {
      const date = dayjs(event.attributes.Date)

      const curr = {
        hours: `${event.attributes.Start.slice(3, -4)} - ${event.attributes.End.slice(3, -4)}`,
        subject: event.attributes.Title,
        description: event.attributes.Description,
      }

      if (index[event.attributes.Date]) {
        index[event.attributes.Date].events.push(curr)
      } else {
        index[event.attributes.Date] = {
          dayNum: date.format('D'),
          dayName: date.format('ddd'),
          events: [curr],
        }
      }
    }

    const data = JSON.stringify(Object.values(index))
    res.status(200).send(data)
  } catch (e) {
    res.status(400).send('Bad Request')
  }
}
