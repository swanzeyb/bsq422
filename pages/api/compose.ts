import type { NextApiRequest, NextApiResponse } from 'next'
import { genCompose } from './wp-jam/index'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const compose:string = await genCompose()
  res.status(200).send(compose)
}
