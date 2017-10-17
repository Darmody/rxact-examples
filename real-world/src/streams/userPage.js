import { StateStream } from 'rxact'
import userStream from './user'
import pagination from './pagination'

const userPageStream = new StateStream('userPage', {}, [userStream, pagination])
const { eventRunner } = userPageStream

const initialize = () => {
  pagination.cleanPage()
  userStream.resetStarredRepos()
  userStream.isFetching(true)()
}

userPageStream.loadData = name => eventRunner(
  event$ => event$
    .do(initialize)
    .do(userStream.isFetching(true))
    .mergeMap(userStream.login)
    .mergeMap(() => userStream
      .fetchStarredRepos(name)
      .do(userStream.isFetching(false))
    ),
  name,
)

export default userPageStream
