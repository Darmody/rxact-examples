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
const { eventRunner } = repoStream

repoStream.emitter('isFetching', fetching => state => state.set('isFetching', fetching))

repoStream.emitter('cleanError', () => state => state.set('errorMessage', ''))

repoStream.emitter('updateError', error => state =>
  state.set('errorMessage', error.message || 'Something went wrong!')
)

repoStream.emitter('updateDetail', detail => state =>
  state.update('detail', value => value.merge(detail))
)

repoStream.emitter('updateStargazers', repos => state =>
  state.update('stargazers', value => value.concat(repos))
)

repoStream.emitter('resetStargazers', () => state =>
  state.set('stargazers', [])
)

repoStream.handleError = error => eventRunner(error$ => error$
  .do(error => console.error(error))
  .do(repoStream.updateError),
  error,
)

repoStream.fetch = name => eventRunner(name$ => name$
  .switchMap(fetchRepo)
  .pluck('response')
  .map(camelizeKeys)
  .map(repoStream.updateDetail)
  .catch(repoStream.handleError),
  name,
)

repoStream.fetchStargazers = (name, page = 1) => eventRunner(event$ => event$
  .switchMap(({ name, page }) => fetchStargazers(name, page))
  .do(paginationStream.nextPage)
  .pluck('response')
  .map(camelizeKeys)
  .do(repoStream.updateStargazers)
  .catch((error) => repoStream.handleError(error)),
  { name, page }
)

export default repoStream
