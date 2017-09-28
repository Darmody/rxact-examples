import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import User from '../components/User'
import Repo from '../components/Repo'
import List from '../components/List'
import userStream from '../streams/user'
import userPageStream from '../streams/userPage'

class UserPage extends Component {
  componentWillMount() {
    const login = this.props.match.params.login.toLowerCase()

    userPageStream.loadData(login)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.login !== nextProps.match.params.login) {
      userPageStream.loadData(nextProps.match.params.login)
    }
  }

  handleLoadMoreClick = () => {
    const login = this.props.match.params.login.toLowerCase()
    const page = this.props.pagination.pageCount

    userStream.fetchStarredRepos(login, page + 1)
  }

  renderRepo(repo) {
    return (
      <Repo
        repo={repo}
        owner={repo.owner}
        key={repo.fullName} />
    )
  }

  render() {
    const { user, pagination } = this.props
    const login = this.props.match.params.login

    if (!user.profile.login) {
      return <h1><i>Loading {login}{"'s profile..."}</i></h1>
    }

    return (
      <div>
        <User user={user.profile} />
        <hr />
        <List
          renderItem={this.renderRepo}
          isFetching={user.isFetching}
          items={user.starredRepos}
          onLoadMoreClick={this.handleLoadMoreClick}
          loadingLabel={`Loading ${user.login}'s starred...`}
          {...pagination}
          />
      </div>
    )
  }
}

export default withRouter(
  userPageStream.observer(state => ({
    ...state,
    user: state.user.toJS(),
    pagination: state.pagination.toJS(),
  }))(UserPage)
)
