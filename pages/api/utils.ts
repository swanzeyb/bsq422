import passwordGenerator from 'generate-password'
import { uniqueNamesGenerator, adjectives, languages, colors } from 'unique-names-generator'

export function usernameGen() {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, languages, colors],
    separator: '',
    length: 2,
  })
  return name.replace(/\s/g,'')
}

export function passwordGen() {
  return passwordGenerator.generate({
    length: 18,
    numbers: true,
  })
}

export function generateLogin() {
  return {
    username: usernameGen(),
    password: passwordGen(),
  }
}
