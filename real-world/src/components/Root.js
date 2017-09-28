import React, { PureComponent } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App'
import UserPage from './UserPage'
import RepoPage from './RepoPage'
import ROOT_PATH from '../rootPath'

export default class Root extends PureComponent {
  render() {
    return (
      <Router>
        <div>
          <Route path={ROOT_PATH} component={App} />
          <Route path={`${ROOT_PATH}:login/:name`} component={RepoPage} exact />
          <Route path={`${ROOT_PATH}:login`} component={UserPage} exact />
        </div>
      </Router>
    )
  }
}
