import React, { Component } from 'react'
import TodoTextInput from './TodoTextInput'
import todoStream from '../streams/todo'

export default class Header extends Component {
  handleSave = text => {
    if (text.length !== 0) {
      todoStream.add(text)
    }
  }

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <TodoTextInput
          newTodo
          onSave={this.handleSave}
          placeholder="What needs to be done?"
        />
      </header>
    )
  }
}
