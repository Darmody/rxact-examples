import { createStateStream } from 'rxact'
import userStream from './user'
import pagination from './pagination'

const userPageStream = createStateStream('userPage', {}, [userStream, pagination])
const { createEvent } = userPageStream

const initialize = () => {
  pagination.cleanPage()
  userStream.resetStarredRepos()
}

userPageStream.loadData = createEvent(event$ => event$
  .do(initialize)
  .do(userStream.isFetching(true))
  .pluck('payload')
  .do(name => userStream.login(name)
    .switchMap(() => userStream.fetchStarredRepos(name))
    .do(userStream.isFetching(false))
    .subscribe()
  )
)

export default userPageStream
