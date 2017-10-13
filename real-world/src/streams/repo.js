import Rx from 'rxjs'
import { Map, List } from 'immutable'
import { StateStream } from 'rxact'
import { camelizeKeys } from 'humps'
import paginationStream from './pagination'
import { fetchRepo, fetchStargazers } from '../APIClient'

const initialState = Map({
  detail: Map({}),
  stargazers: List(),
  isFetching: false,
  errorMessage: '',
})

const repoStream = new StateStream('repo', initialState)
const { eventRunner, next: emitState } = repoStream

repoStream.isFetching = fetching => () => emitState(state => state.set('isFetching', fetching))

repoStream.cleanError = () => emitState(state => state.set('errorMessage', ''))

const handleError = (error) => {
  emitState(state => state.set('errorMessage', error.message || 'Something went wrong!'))
  console.error(error)

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

repoStream.fetch = (name) => eventRunner(
  event$ => event$
  .switchMap(fetchRepo)
  .pluck('response')
  .map(camelizeKeys)
  .map(updateDetail)
  .catch(handleError),
  name,
)

repoStream.fetchStargazers = (name, page = 1) => eventRunner(
  event$ => event$
  .switchMap(({ name, page }) => fetchStargazers(name, page))
  .do(paginationStream.nextPage)
  .pluck('response')
  .map(camelizeKeys)
  .do(updateStargazers)
  .catch((error) => handleError(error)),
  { name, page },
)

export default repoStream
