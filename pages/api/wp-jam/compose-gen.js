import axios from 'axios'

const COMPOSE_SRC = `https://gist.githubusercontent.com/swanzeyb/369644a96a4dc4d24a234691f7cf4c97/raw/f6f7dba2f656cf2b5eba7ebe19be459a813ef46f/docker-compose.yml`

export default function genCompose() {
  return axios.get(COMPOSE_SRC)
    .then(({data}) => data)
}
