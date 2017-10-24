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

userStream.emitter('isFetching', fetching => state =>
  state.set('isFetching', fetching)
)

userStream.emitter('cleanError', () => state =>
  state.set('errorMessage', '')
)

userStream.emitter('handleError', (error) => {
  console.error(error)

  return (state) => {
    return state.set(
      'errorMessage', error.message || 'Something went wrong!'
    )
  }
})

userStream.emitter('updateProfile', profile => state =>
  state.update('profile', value => value.merge(profile))
)

userStream.emitter('updateStarredRepos', repos => state =>
  state.update('starredRepos', value => value.concat(repos))
)

userStream.emitter('resetStarredRepos', () => state =>
  state.set('starredRepos', [])
)

userStream.login = name => userStream.eventRunner(name$ => name$
  .switchMap(fetchUser)
  .pluck('response')
  .map(camelizeKeys)
  .map(userStream.updateProfile)
  .catch(userStream.handleError),
  name,
)

userStream.fetchStarredRepos = (name, page = 1) => userStream.eventRunner(
  name$ => name$
    .switchMap(({ name, page }) => fetchStarred(name, page))
    .do(paginationStream.nextPage)
    .pluck('response')
    .map(camelizeKeys)
    .do(userStream.updateStarredRepos)
    .catch(userStream.handleError),
  ({ name, page })
)

export default userStream
