import { applyMiddleware, compose, createStore } from 'redux'

import { addActionId } from './middleware/addActionId.js'
import { apiMiddleware } from './middleware/api.js'
import emptyState from './emptyState'
import { fromJS } from 'immutable'
import reducers from './reducers.js'
import { handleBusy } from './middleware/handleBusy'

const defaultStore = window.defaultStore ? fromJS(window.defaultStore) : emptyState

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(addActionId, apiMiddleware, handleBusy)),
  )
  return store
}

export const store = configureStore(defaultStore)
