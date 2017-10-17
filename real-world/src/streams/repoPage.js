import { StateStream } from 'rxact'
import repoStream from './repo'
import paginationStream from './pagination'

const repoPageStream = new StateStream('repoPage', {}, [repoStream, paginationStream])
const { eventRunner } = repoPageStream

const initialize = () => {
  paginationStream.cleanPage()
  repoStream.resetStargazers()
}

repoPageStream.loadData = (name) => eventRunner(
  event$ => event$
    .do(initialize)
    .do(repoStream.isFetching(true))
    .filter(event => !!event)
    .mergeMap(repoStream.fetch)
    .mergeMap(() => repoStream
      .fetchStargazers(name)
      .do(repoStream.isFetching(false))
    ),
  name,
)

export default repoPageStream
