import Rx from 'rxjs'
import { plugin as reactObserver } from 'rxact-react'
import { setup } from 'rxact'

setup({ Observable: Rx.Observable, plugins: [reactObserver()] })
