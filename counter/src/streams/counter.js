import { StateStream } from 'rxact'

const counterStream = new StateStream('counter', 0)

const {
  next: emitState,
  eventRunner,
} = counterStream

const updater = diff => count => (count + diff)

counterStream.increment = () => emitState(updater(1))

counterStream.incrementAsync  = () => eventRunner(event$ => event$
  .delay(500)
  .do(counterStream.increment)
)

counterStream.decrement = () => emitState(updater(-1))

counterStream.incrementIfOdd = () => eventRunner(event$ => event$
  .skipWhile(state => state % 2 === 0)
  .do(counterStream.increment)
)

export default counterStream
