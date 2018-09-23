import 'babel-polyfill'

import AppRoot from 'COMPONENTS/AppRoot.jsx'
import { Provider } from 'react-redux'
import React from 'react'
import { initServiceWorker } from 'UTILS/serviceWorker.js'
import { render } from 'react-dom'
import { store } from 'STORE/store.js'

require('font-awesome-webpack')

initServiceWorker()

render(
  <Provider store={store}>
    <AppRoot />
  </Provider>,
  document.getElementById('root'),
)
