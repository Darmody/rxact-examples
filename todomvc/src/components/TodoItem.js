import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import todoStream from '../streams/todo'
import TodoTextInput from './TodoTextInput'

export default class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.object.isRequired,
  }

  state = {
    editing: false
  }

  handleDoubleClick = () => {
    this.setState({ editing: true })
  }

  handleSave = (id, text) => {
    if (text.length === 0) {
      todoStream.delete(id)
    } else {
      todoStream.edit(id, text)
    }
    this.setState({ editing: false })
  }

  render() {
    const { todo } = this.props

    let element
    if (this.state.editing) {
      element = (
        <TodoTextInput text={todo.text}
          editing={this.state.editing}
          onSave={(text) => this.handleSave(todo.id, text)}
        />
      )
    } else {
      element = (
        <div className="view">
          <input className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => todoStream.complete(todo.id)}
          />
          <label onDoubleClick={this.handleDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy"
            onClick={() => todoStream.delete(todo.id)}
          />
        </div>
      )
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing: this.state.editing
      })}>
        {element}
      </li>
    )
  }
}
