import Handlebars from 'handlebars'
import axios from 'axios'
import path from 'path'
import { generateLogin } from '../utils'

const ENV_SRC = `https://gist.github.com/swanzeyb/9ac868f5cacdd46371d196161051028f/raw/.env.template`

function getWPVals(): Promise<{ [key: string]: string }> {
  const vals: { [key: string]: string } = {}
  return axios.get('https://api.wordpress.org/secret-key/1.1/salt/')
    .then(({data}): string[] => data.split('\n'))
    .then((rows) => rows.map(row => row.split('\'')))
    .then((rows) => rows.map(row => {
      const key = row[1]
      let val = row[3]
      if (key && val) {
        val = val.replace(/\$/g, '$$$$')
        vals[key] = val
      }
    }))
    .then(() => vals)
}

interface Environment {
  puid: number,
  pgid: number,
  tz: string,
  proxyDir: string,
  databaseDir: string,
  wpDir: string,
  email: string,
  mysqlDatabase: string,
  mysqlUsername: string,
  mysqlPassword: string,
  mysqlRootPassword: string,
  wpAuthKey: string,
  wpSecureAuthKey: string,
  wpLoggedInKey: string,
  wpNonceKey: string,
  wpAuthSalt: string,
  wpSecureAuthSalt: string,
  wpLoggedInSalt: string,
  wpNonceSalt: string,
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

  const {
    AUTH_KEY: wpAuthKey,
    SECURE_AUTH_KEY: wpSecureAuthKey,
    LOGGED_IN_KEY: wpLoggedInKey,
    NONCE_KEY: wpNonceKey,
    AUTH_SALT: wpAuthSalt,
    SECURE_AUTH_SALT: wpSecureAuthSalt,
    LOGGED_IN_SALT: wpLoggedInSalt,
    NONCE_SALT: wpNonceSalt,
  } = await getWPVals()

  return {
    puid:         1000,
    pgid:         1000,
    tz:          'America/Los_Angeles',
    proxyDir:     path.join(mount, '/proxy'),
    databaseDir:  path.join(mount, '/database'),
    wpDir:        path.join(mount, '/wordpress'),
    email,
    mysqlDatabase,
    mysqlUsername,
    mysqlPassword,
    mysqlRootPassword,
    wpAuthKey,
    wpSecureAuthKey,
    wpLoggedInKey,
    wpNonceKey,
    wpAuthSalt,
    wpSecureAuthSalt,
    wpLoggedInSalt,
    wpNonceSalt,
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

export default function wpEnvironment({ mount, domain, subdomains, email }: CurrEnvironment): Promise<string> {
  return genEnvironment({ mount, domain, subdomains, email })
    .then(genFile)
}
