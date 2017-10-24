import { StateStream } from 'rxact'
import userStream from './user'
import pagination from './pagination'

const userPageStream = new StateStream('userPage', {}, [userStream, pagination])

const initialize = () => {
  pagination.cleanPage()
  userStream.resetStarredRepos()
  userStream.isFetching(true)
}

userPageStream.loadData = name => userPageStream.eventRunner(name$ => name$
  .do(initialize)
  .user$login()
  .mergeAll()
  .user$fetchStarredRepos(name)
  .mergeAll()
  .user$isFetching(false),
  name
)

export default userPageStream
