import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import todoStream from '../streams/todo'

const FILTER_TITLES = {
  [todoStream.FILTERS.SHOW_ALL]: 'All',
  [todoStream.FILTERS.SHOW_ACTIVE]: 'Active',
  [todoStream.FILTERS.SHOW_COMPLETED]: 'Completed'
}

export default class Footer extends Component {
  static propTypes = {
    completedCount: PropTypes.number.isRequired,
    activeCount: PropTypes.number.isRequired,
    filter: PropTypes.string.isRequired,
    onShow: PropTypes.func.isRequired
  }

  renderTodoCount() {
    const { activeCount } = this.props
    const itemWord = activeCount === 1 ? 'item' : 'items'

    return (
      <span className="todo-count">
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
    )
  }

  renderFilterLink(filter) {
    const title = FILTER_TITLES[filter]
    const { filter: selectedFilter, onShow } = this.props

    return (
      <a
        className={classnames({ selected: filter === selectedFilter })}
        style={{ cursor: 'pointer' }}
        onClick={() => onShow(filter)}
      >
        {title}
      </a>
    )
  }

  renderClearButton() {
    const { completedCount } = this.props
    if (completedCount > 0) {
      return (
        <button className="clear-completed" onClick={todoStream.clearCompleted} >
          Clear completed
        </button>
      )
    }
  }

  render() {
    return (
      <footer className="footer">
        {this.renderTodoCount()}
        <ul className="filters">
          {Object.keys(todoStream.FILTERS).map(filter =>
            <li key={filter}>
              {this.renderFilterLink(filter)}
            </li>
          )}
        </ul>
        {this.renderClearButton()}
      </footer>
    )
  }
}
