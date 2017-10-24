import { StateStream } from 'rxact'
import repoStream from './repo'
import paginationStream from './pagination'

const repoPageStream = new StateStream('repoPage', {}, [repoStream, paginationStream])

const initialize = () => {
  paginationStream.cleanPage()
  repoStream.resetStargazers()
}

repoPageStream.loadData = name => repoPageStream.eventRunner(name$ => name$
  .do(initialize)
  .repo$isFetching(true)
  .filter(name => !!name)
  .repo$fetch()
  .mergeAll()
  .repo$fetchStargazers(name)
  .mergeAll()
  .repo$isFetching(false),
  name,
)

export default repoPageStream
