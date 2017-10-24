import Rx from 'rxjs'
import { plugin as reactObserver } from 'rxact-react'
import { plugin as rxactRxjs } from 'rxact-rxjs'
import { plugin as rxactDebugger } from 'rxact-debugger'
import { setup } from 'rxact'

const plugins = [reactObserver(), rxactRxjs()]

if (process.env.NODE_ENV !== 'production') {
  plugins.push(rxactDebugger({ start: true }))
}

setup({
  Observable: Rx.Observable,
  plugins,
})
