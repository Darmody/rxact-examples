import React, { Component } from 'react'
import PropTypes from 'prop-types'
import postStream from '../streams/post'
import Picker from './Picker'
import Posts from './Posts'

class App extends Component {
  static propTypes = {
    selectedReddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
  }

  componentDidMount() {
    this.fetchPostsSubscription = postStream.fetchPostsIfNeeded().subscribe()
  }

  componentWillUnMount() {
    if (this.fetchPostsSubscription) {
      this.fetchPostsSubscription.unsubscribe()
    }
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated } = this.props
    const isEmpty = posts.length === 0
    return (
      <div>
        <Picker
          value={selectedReddit}
          onChange={postStream.updateReddit}
          options={['reactjs', 'frontend']}
        />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <button onClick={postStream.fetchPosts}>
              Refresh
            </button>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        }
      </div>
    )
  }
}

export default postStream.reactObserver(state => ({
  selectedReddit: state.reddit,
  posts: state.items[state.reddit] || [],
  isFetching: state.isFetching,
  lastUpdated: state.lastUpdated,
}))(App)
