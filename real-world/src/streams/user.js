import { Map, List } from 'immutable'
import { createStateStream } from 'rxact'
import { camelizeKeys } from 'humps'
import paginationStream from './pagination'
import { fetchUser, fetchStarred } from '../APIClient'

const initialState = Map({
  profile: Map(),
  starredRepos: List(),
  isFetching: false,
  errorMessage: '',
})

const userStream = createStateStream('user', initialState)
const createEvent = userStream.createEvent
const emitState = userStream.emitState

userStream.isFetching = fetching => () => emitState(state => state.set('isFetching', fetching))

userStream.cleanError = emitState(state => state.set('errorMessage', ''))

const handleError = error => emitState(state =>
  state.set('errorMessage', error.message || 'Something went wrong!')
)

const updateProfile = profile => emitState(state =>
  state.update('profile', value => value.merge(profile))
)

const updateStarredRepos = repos => emitState(state =>
  state.update('starredRepos', value => value.concat(repos))
)

userStream.resetStarredRepos = () => emitState(state =>
  state.set('starredRepos', [])
)

userStream.login = createEvent(event$ => event$
  .pluck('payload')
  .switchMap(fetchUser)
  .pluck('response')
  .map(camelizeKeys)
  .map(updateProfile)
  .catch(handleError)
)

userStream.fetchStarredRepos = createEvent(
  event$ => event$
    .pluck('payload')
    .switchMap(({ name, page }) => fetchStarred(name, page))
    .do(paginationStream.nextPage)
    .pluck('response')
    .map(camelizeKeys)
    .do(updateStarredRepos)
    .catch(handleError),
  (name, page = 1) =>  ({ name, page }),
)

export default userStream
