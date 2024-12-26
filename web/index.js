import AppRoot from './components/AppRoot.jsx'
import { Provider } from 'react-redux'
import React from 'react'
import { initServiceWorker } from './utils/serviceWorker.js'
import { render } from 'react-dom'
import { store } from './store/store.js'

import 'font-awesome/css/font-awesome.css'

initServiceWorker()

render(
  <Provider store={store}>
    <AppRoot />
  </Provider>,
  document.getElementById('root'),
)
