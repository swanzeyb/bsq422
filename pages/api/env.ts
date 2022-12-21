import type { NextApiRequest, NextApiResponse } from 'next'
import { genEnv } from './wp-jam/index'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const { mount, domain, subdomains, email } = req.query
  const env:string = await genEnv(mount, domain, subdomains, email)
  res.status(200).send(env)
}
