import { createStateStream } from 'rxact'
import repoStream from './repo'
import paginationStream from './pagination'

const repoPageStream = createStateStream('repoPage', {}, [repoStream, paginationStream])
const { createEvent } = repoPageStream

const initialize = () => {
  paginationStream.cleanPage()
  repoStream.resetStargazers()
}

repoPageStream.loadData = createEvent(event$ => event$
  .do(initialize)
  .do(repoStream.isFetching(true))
  .filter(event => !!event)
  .pluck('payload')
  .do(name => repoStream.fetch(name)
    .switchMap(() => repoStream.fetchStargazers(name))
    .do(repoStream.isFetching(false))
    .subscribe()
  )
)

export default repoPageStream
