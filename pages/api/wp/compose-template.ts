import axios from 'axios'

const COMPOSE_SRC = `https://gist.github.com/swanzeyb/369644a96a4dc4d24a234691f7cf4c97/raw/docker-compose.yml`

export default function wpCompose(): Promise<string> {
  return axios.get(COMPOSE_SRC)
    .then(({data}) => data)
}
