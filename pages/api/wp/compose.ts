import type { NextApiRequest, NextApiResponse } from 'next'
import wpCompose from './compose-template'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const compose = await wpCompose()
  res.status(200).send(compose)
}
