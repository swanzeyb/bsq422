
import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import assert from 'node:assert'
import axios from 'axios'

dayjs.extend(utc)
dayjs.extend(timezone)

assert(process.env.GOOGLE_CREDENTIALS, 'No Google credentials found')
assert(process.env.CALENDAR_ID, 'No calendar ID found')
assert(process.env.API_URL, 'No Strapi API URL found')
assert(process.env.API_KEY, 'No Strapi API key found')
assert(process.env.SYNC_AMT, 'No sync amount found')

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS as string),
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/calendar.readonly',
  ],
})

const calendar = google.calendar({ version: 'v3', auth })

interface Event {
  Title: string,
  Description: string,
  Date: string,
  Start: string,
  End: string,
  eventId: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const now = dayjs().utc().format()
    const agenda = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      maxResults: Number(process.env.SYNC_AMT),
      orderBy: 'startTime',
      showDeleted: false,
      showHiddenInvitations: false,
      singleEvents: true,
      timeMin: now,
    })
    assert(agenda?.data?.items, 'No events found')
    assert(agenda.data.items.length > 0, 'No events found')
    assert(agenda.data.items[0]?.start?.timeZone, 'No timezone found')
    const tz = agenda.data.items[0].start.timeZone

    const events: Event[] = []
    for (const event of agenda.data.items) {
      const start = dayjs(event?.start?.dateTime).tz(tz)
      const end = dayjs(event?.end?.dateTime).tz(tz)

      events.push({
        Title: event.summary as string,
        Description: event.description as string,
        Date: start.format('YYYY-MM-DD'),
        Start: `00:${start.format('HH:mm')}.000`,
        End: `00:${end.format('HH:mm')}.000`,
        eventId: event.id as string,
      })
    }

    console.log(events.length, 'events found.')

    await Promise.all(events.map(async (event) => {
      try {
        await axios({
          method: 'post',
          url: process.env.API_URL,
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json',
          },
          data: { data: { ...event } },
          validateStatus: () => true,
        })
      } catch (e) {
      }
    }))
    
    res.status(200).send('OK')
  } catch (e) {
    console.log(e)
    res.status(400).send('Bad Request')
  }
}
