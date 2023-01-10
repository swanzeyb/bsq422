import type { NextApiRequest, NextApiResponse } from 'next'
import wpEnvironment from './env-template'

interface EnvApiRequest extends NextApiRequest {
  query: {
    mount: string,
    domain: string,
    subdomains: string,
    email: string,
  },
}

export default async function handler(
  req: EnvApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const { mount, domain, subdomains, email } = req.query
    const environment = await wpEnvironment({ mount, domain, subdomains, email })
    res.status(200).send(environment)
  } catch (e) {
    res.status(400)
  }
}
