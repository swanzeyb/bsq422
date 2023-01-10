import type { NextApiRequest, NextApiResponse } from 'next'
import strapiEnvironment from './env-template'

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
    const environment = await strapiEnvironment({ mount, domain, subdomains, email })
    res.status(200).send(environment)
  } catch (e) {
    res.status(400).send('Bad Request')
  }
}
