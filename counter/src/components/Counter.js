import React, { Component } from 'react'
import PropTypes from 'prop-types'
import counterStream from '../streams/counter'

class Counter extends Component {
  render() {
    const { value } = this.props
    return (
      <p>
        Clicked: {value} times
        {' '}
        <button onClick={counterStream.increment}>
          +
        </button>
        {' '}
        <button onClick={counterStream.decrement}>
          -
        </button>
        {' '}
        <button onClick={counterStream.incrementIfOdd}>
          Increment if odd
        </button>
        {' '}
        <button onClick={counterStream.incrementAsync}>
          Increment async
        </button>
      </p>
    )
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
}

export default counterStream.observer(
  (state => ({ value: state })),
)(Counter)
