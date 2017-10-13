import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import repoPageStream from '../streams/repoPage'
import repoStream from '../streams/repo'
import Repo from './Repo'
import User from './User'
import List from './List'

class RepoPage extends Component {
  componentWillMount() {
    repoPageStream.loadData(this.props.fullName)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullName !== this.props.fullName) {
      repoPageStream.loadData(nextProps.fullName)
    }
  }

  handleLoadMoreClick = () => {
    const page = this.props.pagination.pageCount

    repoStream.fetchStargazers(this.props.fullName, page + 1)
  }

  renderUser(user) {
    return <User user={user} key={user.login} />
  }

  render() {
    const { repo, fullName, pagination } = this.props
    if (!repo.detail.owner) {
      return <h1><i>Loading {fullName} details...</i></h1>
    }

    const stargazers = repo.stargazers

    return (
      <div>
        <Repo repo={repo.detail}
              owner={repo.detail.owner} />
        <hr />
        <List renderItem={this.renderUser}
              items={stargazers}
              onLoadMoreClick={this.handleLoadMoreClick}
              loadingLabel={`Loading stargazers of ${fullName}...`}
              isFetching={repo.isFetching}
              {...pagination} />
      </div>
    )
  }
}

export default withRouter(
  repoPageStream.reactObserver((state, props) => {
    const login = props.match.params.login.toLowerCase()
    const name = props.match.params.name.toLowerCase()

    const fullName = `${login}/${name}`

    return {
      ...state,
      repo: state.repo.toJS(),
      pagination: state.pagination.toJS(),
      fullName,
    }
  })(RepoPage)
)
