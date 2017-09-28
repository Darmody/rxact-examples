import 'rxjs'
import { createStateStream } from 'rxact'

const todoStream = createStateStream('todos', [])
const emitState = todoStream.emitState

todoStream.add = text => emitState(state => [
  ...state,
  {
    text,
    id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
    completed: false,
  },
])

todoStream.edit = (id, text) => emitState(state => state.map(
  todo => todo.id === id ? { ...todo, text } : todo
))

todoStream.delete = id => emitState(state =>
  state.filter(todo => todo.id !== id )
)

todoStream.complete = id => emitState(state => state.map(
  todo => todo.id === id ?
    { ...todo, completed: !todo.completed } :
    todo
))


todoStream.completeAll = () => emitState(state => {
  const areAllMarked = state.every(todo => todo.completed)

  return state.map(todo => ({
    ...todo,
    completed: !areAllMarked
  }))
})

todoStream.clearCompleted = () => emitState(state =>
  state.filter(todo => todo.completed === false)
)

todoStream.FILTERS = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
}

export default todoStream
