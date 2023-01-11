
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    res.status(200).send(JSON.stringify(req?.query, null, 2))
  } catch (e) {
    res.status(400).send('Bad Request')
  }
}
