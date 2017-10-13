import { Map, List } from 'immutable'
import { StateStream } from 'rxact'
import { camelizeKeys } from 'humps'
import paginationStream from './pagination'
import { fetchUser, fetchStarred } from '../APIClient'

const initialState = Map({
  profile: Map(),
  starredRepos: List(),
  isFetching: false,
  errorMessage: '',
})

const userStream = new StateStream('user', initialState)
const { eventRunner, next: emitState } = userStream

userStream.isFetching = fetching => () => emitState(state => state.set('isFetching', fetching))

userStream.cleanError = () => emitState(state => state.set('errorMessage', ''))

const handleError = error => {
  emitState(state =>
    state.set('errorMessage', error.message || 'Something went wrong!')
  )

  console.error(error)
}

const updateProfile = profile => emitState(state =>
  state.update('profile', value => value.merge(profile))
)

const updateStarredRepos = repos => emitState(state =>
  state.update('starredRepos', value => value.concat(repos))
)

userStream.resetStarredRepos = () => emitState(state =>
  state.set('starredRepos', [])
)

userStream.login = name => eventRunner(
  event$ => event$
    .switchMap(fetchUser)
    .pluck('response')
    .map(camelizeKeys)
    .map(updateProfile)
    .catch(handleError),
  name,
)

userStream.fetchStarredRepos = (name, page = 1) => eventRunner(
  event$ => event$
    .switchMap(({ name, page }) => fetchStarred(name, page))
    .do(paginationStream.nextPage)
    .pluck('response')
    .map(camelizeKeys)
    .do(updateStarredRepos)
    .catch(handleError),
  { name, page },
)

export default userStream
