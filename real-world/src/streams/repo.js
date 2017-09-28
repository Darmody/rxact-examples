import Rx from 'rxjs'
import { Map, List } from 'immutable'
import { createStateStream } from 'rxact'
import { camelizeKeys } from 'humps'
import paginationStream from './pagination'
import { fetchRepo, fetchStargazers } from '../APIClient'

const initialState = Map({
  detail: Map({}),
  stargazers: List(),
  isFetching: false,
  errorMessage: '',
})

const repoStream = createStateStream('repo', initialState)
const createEvent = repoStream.createEvent
const emitState = repoStream.emitState

repoStream.isFetching = fetching => () => emitState(state => state.set('isFetching', fetching))

repoStream.cleanError = emitState(state => state.set('errorMessage', ''))

const handleError = (error) => {
  emitState(state => state.set('errorMessage', error.message || 'Something went wrong!'))

  return Rx.Observable.empty()
}

const updateDetail = detail => emitState(state =>
  state.update('detail', value => value.merge(detail))
)

const updateStargazers = repos => emitState(state =>
  state.update('stargazers', value => value.concat(repos))
)

repoStream.resetStargazers = () => emitState(state =>
  state.set('stargazers', [])
)

repoStream.fetch = createEvent(event$ => event$
  .pluck('payload')
  .switchMap(fetchRepo)
  .pluck('response')
  .map(camelizeKeys)
  .map(updateDetail)
  .catch(handleError)
)

repoStream.fetchStargazers = createEvent(
  event$ => event$
    .pluck('payload')
    .switchMap(({ name, page }) => fetchStargazers(name, page))
    .do(paginationStream.nextPage)
    .pluck('response')
    .map(camelizeKeys)
    .do(updateStargazers)
    .catch((error) => handleError(error)),
  (name, page = 1) =>  ({ name, page }),
)

export default repoStream
