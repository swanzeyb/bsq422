import axios from 'axios'

const COMPOSE_SRC = `https://gist.github.com/swanzeyb/15b71397670b01af6aae5a8d8b3c42c5/raw/docker-compose.yml`

export default function strapiCompose(): Promise<string> {
  return axios.get(COMPOSE_SRC)
    .then(({data}) => data)
}
