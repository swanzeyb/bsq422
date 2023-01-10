import type { NextApiRequest, NextApiResponse } from 'next'
import strapiCompose from './compose-template'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const compose = await strapiCompose()
  res.status(200).send(compose)
}
