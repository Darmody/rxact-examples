import 'rxjs'
import { createStateStream } from 'rxact'

const counterStream = createStateStream('counter', 0)

const emitState = counterStream.emitState
const createEvent = counterStream.createEvent

const updater = diff => count => (count + diff)

counterStream.increment = () => emitState(updater(1))

counterStream.incrementAsync = createEvent(event$ => event$
  .delay(500)
  .do(() => counterStream.increment())
)

counterStream.decrement = () => emitState(updater(-1))

counterStream.incrementIfOdd = createEvent(event$ => event$
  .pluck('state')
  .skipWhile(state => state % 2 === 0)
  .do(() => counterStream.increment())
)

export default counterStream
