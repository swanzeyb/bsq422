import type { NextApiRequest, NextApiResponse } from 'next'
import assert from 'node:assert'
import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.tz.setDefault('America/Los_Angeles')

const { BLOSSOM_API_KEY, BLOSSOM_API_URL } = process.env

assert(BLOSSOM_API_KEY, 'BLOSSOM_API_KEY is not defined')
assert(BLOSSOM_API_URL, 'BLOSSOM_API_URL is not defined')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    // Current event
    const today = await axios({
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
    })
    .then(res => res.data.data)

    const now = dayjs('2023-01-16 12:00:00')

    let currEvent = null
    for (const event of today) {
      const start = now
        .set('hour', Number(event.attributes.Start.slice(3, -7)))
        .set('minute', Number(event.attributes.Start.slice(6, -4)))
      const end = now
        .set('hour', Number(event.attributes.End.slice(3, -7)))
        .set('minute', Number(event.attributes.End.slice(6, -4)))

      if (now.isBetween(start, end, 'minute', '[)')) {
        currEvent = event
        break
      }
    }

    // This week tasks
    const currTasks = await axios({
      method: 'GET',
      url: [
        BLOSSOM_API_URL,
        'tasks?sort=Due:ASC&filters[$and][0][Due][$gt]=',
        now.startOf('week').format('YYYY-MM-DD'),
        '&filters[$and][1][Due][$lte]=',
        now.endOf('week').add(2, 'days').format('YYYY-MM-DD'),
      ].join(''),
      headers: {
        Authorization: `Bearer ${BLOSSOM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.data.data)

    // Previous unfinished tasks
    const prevTasks = await axios({
      method: 'GET',
      url: [
        BLOSSOM_API_URL,
        'tasks?sort=Due:ASC&filters[$and][0][Done][$eq]=false&filters[$and][1][Due][$lte]=',
        now.startOf('week').format('YYYY-MM-DD'),
      ].join(''),
      headers: {
        Authorization: `Bearer ${BLOSSOM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.data.data)

    const allTasks = [...prevTasks, ...currTasks]

    console.log(prevTasks)

    console.log(currTasks)

    // Finished tasks
    const finished = allTasks.reduce((done, task) => {
      return task.attributes.Done ? done + 1 : done
    }, 0)
    const remaining = allTasks.length - finished

    const tasks = [
      ...prevTasks.reduce((acc: any, task: { attributes: { Done: any } }) => (
        task.attributes.Done ? acc : [...acc, task]
      ), []),
      ...currTasks,
    ]

    const data = JSON.stringify({
      currEvent,
      // tasks,
      finished,
      remaining,
    })

    return res.status(200).send(data)
  } catch (e) {
    res.status(400).send('Bad Request')
  }
}
