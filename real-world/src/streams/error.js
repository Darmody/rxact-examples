import { createStateStream } from 'rxact'
import user from './user'
import repo from './repo'

const errorStream = createStateStream('error', {}, [user, repo])

errorStream.cleanError = () => {
  user.cleanError()
  repo.cleanError()
}

export default errorStream
