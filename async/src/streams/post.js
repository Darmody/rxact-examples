import { ajax } from 'rxjs/observable/dom/ajax'
import { StateStream } from 'rxact'

const postStream = new StateStream('posts', {
  reddit: 'reactjs',
  items: {},
  isFetching: false,
  lastUpdated: null,
})

const {
  next: emitState,
  eventRunner,
} = postStream

const inFetching = (isFetching) => emitState(state => ({
  ...state,
  isFetching,
}))

const stillFetching = (prev, next) => next.isFetching

const postsExist = (prevState, nextState) => {
  const posts = nextState.items[nextState.reddit]
  return posts && posts.length > 0
}

const fetchPosts = (reddit) => ajax({
  url: `https://www.reddit.com/r/${reddit}.json`,
  crossDomain: true,
  responseType: 'json',
})
  .pluck('response', 'data', 'children')
  .map(normalize)

const normalize = children => children.map(child => child.data)

const updatePosts = items => emitState(state => ({
  ...state,
  items: {
    ...state.items,
    [state.reddit]: items,
  },
  isFetching: false,
  lastUpdated: Date.now(),
}))

postStream.fetchPosts = () => eventRunner(event$ => event$
  .do(() => inFetching(true))
  .pluck('reddit')
  .switchMap(fetchPosts)
  .do((items) => {
    updatePosts(items)
    inFetching(false)
  })
)

postStream.fetchPostsIfNeeded = () => postStream.state$
  .distinctUntilChanged(stillFetching)
  .distinctUntilChanged(postsExist)
  .do(() => inFetching(true))
  .pluck('reddit')
  .switchMap(fetchPosts)
  .do((items) => {
    updatePosts(items)
    inFetching(false)
  })

postStream.updateReddit = (reddit) => emitState(state => ({
  ...state,
  reddit,
}))

export default postStream
