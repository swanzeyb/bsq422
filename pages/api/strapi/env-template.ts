import Handlebars from 'handlebars'
import axios from 'axios'
import path from 'path'
import { generateLogin } from '../utils'

const ENV_SRC = `https://gist.github.com/swanzeyb/3587843c25509913247f9da6d36bfb48/raw/.env.template`

interface Environment {
  puid: number,
  pgid: number,
  tz: string,
  proxyDir: string,
  databaseDir: string,
  strapiDir: string,
  email: string,
  mysqlDatabase: string,
  mysqlUsername: string,
  mysqlPassword: string,
  mysqlRootPassword: string,
  domain: string,
  subdomains: string,
}

interface CurrEnvironment {
  mount: string,
  domain: string,
  subdomains: string,
  email: string,
}

async function genEnvironment({ mount, domain, subdomains, email }: CurrEnvironment): Promise<Environment> {
  const {
    password: mysqlRootPassword,
  } = generateLogin()
  const {
    username: mysqlDatabase
  } = generateLogin()
  const {
    username: mysqlUsername,
    password: mysqlPassword,
  } = generateLogin()

  return {
    puid:         1000,
    pgid:         1000,
    tz:          'America/Los_Angeles',
    proxyDir:     path.join(mount, '/proxy'),
    databaseDir:  path.join(mount, '/database'),
    strapiDir:    path.join(mount, '/strapi'),
    email,
    mysqlDatabase,
    mysqlUsername,
    mysqlPassword,
    mysqlRootPassword,
    domain,
    subdomains,
  }
}

async function genFile(env: Environment): Promise<string> {
  const envSrc = await axios.get(ENV_SRC)
    .then(({data}) => data)
  const envTemplate = Handlebars.compile(envSrc)
  return envTemplate(env)
}

export default function strapiEnvironment({ mount, domain, subdomains, email }: CurrEnvironment): Promise<string> {
  return genEnvironment({ mount, domain, subdomains, email })
    .then(genFile)
}
