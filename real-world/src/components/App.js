import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import errorStream from '../streams/error'
import Explore from './Explore'
import ROOT_PATH from '../rootPath'

class App extends Component {
  handleDismissClick = e => {
    errorStream.cleanError()
    e.preventDefault()
  }

  handleChange = nextValue => {
    this.props.history.push(`${ROOT_PATH}${nextValue}`)
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        <button onClick={this.handleDismissClick}>
          Dismiss
        </button>
      </p>
    )
  }

  render() {
    const { children, inputValue } = this.props
    return (
      <div>
        <Explore value={inputValue}
                 onChange={this.handleChange} />
        <hr />
        {this.renderErrorMessage()}
        {children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.user.get('errorMessage') || state.repo.get('errorMessage'),
  inputValue: ownProps.location.pathname.substring(ROOT_PATH.length)
})

export default withRouter(errorStream.observer(
  mapStateToProps
)(App))
