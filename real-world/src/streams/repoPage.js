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
    .do(name => repoStream.fetch(name)
      .switchMap(() => repoStream.fetchStargazers(name))
      .do(repoStream.isFetching(false))
      .subscribe()
    ),
  name,
)

export default repoPageStream
