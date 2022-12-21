import Handlebars from 'handlebars'
import passwordGenerator from 'generate-password'
import { uniqueNamesGenerator, adjectives, languages, colors } from 'unique-names-generator'
import axios from 'axios'

const ENV_SRC = `https://gist.githubusercontent.com/swanzeyb/9ac868f5cacdd46371d196161051028f/raw/1e8d8bdd5680c54b577ece93a71f0979d8d0cfeb/.env.template`

function usernameGen() {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, languages, colors],
    separator: '',
    length: 2,
  })
  return name.replace(/\s/g,'')
}

function passwordGen() {
  return passwordGenerator.generate({
    length: 18,
    numbers: true,
  })
}

function generateLogin() {
  return {
    username: usernameGen(),
    password: passwordGen(),
  }
}

function generateWPVals() {
  const vals = {}
  return axios.get('https://api.wordpress.org/secret-key/1.1/salt/')
    .then(({data}) => data.split('\n'))
    .then(rows => rows.map(row => row.split('\'')))
    .then(rows => rows.map(row => {
      const key = row[1]
      let val = row[3]
      if (key && val) {
        // val = val.replace(/\s/g, '\\ ')
        val = val.replace(/\$/g, '$$$$')
        vals[key] = val
      }
    }))
    .then(() => vals)
}

async function genEnvValues(mount, domain, subdomains, email) {
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
  } = await generateWPVals()

  const envValues = {
    puid:         1000,
    pgid:         1000,
    tz:          'America/Los_Angeles',
    proxyDir:    `${mount}/proxy`,
    databaseDir: `${mount}/database`,
    wpDir:       `${mount}/wp`,
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
  return envValues
}

async function createEnvFile(envValues) {
  const envSrc = await axios.get(ENV_SRC)
    .then(({data}) => data)
  const envTemplate = Handlebars.compile(envSrc)
  return envTemplate(envValues)
}

export default function genEnv(mount, domain, subdomains, email) {
  return genEnvValues(mount, domain, subdomains, email)
    .then(createEnvFile)
}
