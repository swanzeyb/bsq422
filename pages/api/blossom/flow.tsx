import type { NextApiRequest, NextApiResponse } from 'next'
import assert from 'node:assert'
import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(advancedFormat)
const tz = 'America/Los_Angeles'
dayjs.tz.setDefault(tz)

const { BLOSSOM_API_KEY, BLOSSOM_API_URL } = process.env

assert(BLOSSOM_API_KEY, 'BLOSSOM_API_KEY is not defined')
assert(BLOSSOM_API_URL, 'BLOSSOM_API_URL is not defined')

async function get(
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

    const now = dayjs.tz(dayjs(), tz)

    let currEvent = null
    for (const event of today) {
      const start = now
        .set('hour', Number(event.attributes.Start.slice(3, -7)))
        .set('minute', Number(event.attributes.Start.slice(6, -4)))
      const end = now
        .set('hour', Number(event.attributes.End.slice(3, -7)))
        .set('minute', Number(event.attributes.End.slice(6, -4)))

      if (now.isBetween(start, end, 'minute', '[)')) {
        currEvent = {
          subject: event.attributes.Title,
          description: event.attributes.Description,
        }
        break
      }
    }

    console.log('Now', now.format('YYYY-MM-DD HH:mm:ss'))
    console.log('Start of week', now.startOf('week').format('YYYY-MM-DD'))
    console.log('End of week', now.endOf('week').add(2, 'days').format('YYYY-MM-DD'))

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

    // Finished tasks
    const finished = allTasks.reduce((done, task) => {
      return task.attributes.Done ? done + 1 : done
    }, 0)
    const remaining = allTasks.length - finished

    // Formatted tasks
    const tasks = [
      ...prevTasks.reduce((acc: any, task: { attributes: { Done: any } }) => (
        task.attributes.Done ? acc : [...acc, task]
      ), []),
      ...currTasks,
    ].map(task => ({
      subject: task.attributes.Title,
      due: dayjs(task.attributes.Due).format('ddd Do'),
      done: task.attributes.Done,
      id: task.id,
    }))

    const data = JSON.stringify({
      currEvent,
      tasks,
      finished,
      remaining,
    })

    return res.status(200).send(data)
  } catch (e) {
    console.log(e)
    res.status(400).send('Bad Request')
  }
}

async function post(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const { id, done } = req.body

    await axios({
      method: 'PUT',
      url: `${BLOSSOM_API_URL}tasks/${id}`,
      headers: {
        Authorization: `Bearer ${BLOSSOM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        data: {
          Done: done
        },
      },
    })

    await get(req, res)
  } catch (e) {
    res.status(400).send('Bad Request')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  if (req.method === 'GET') {
    await get(req, res)
  } else if (req.method === 'PUT') {
    await post(req, res)
  } else {
    res.status(405).send('Method Not Allowed')
  }
}
