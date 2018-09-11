import { setBusy } from 'STORE/actions.js'
import { INITIALIZED, COMPLETE, FAILURE } from './api'

let runningActions = {}

export const handleBusy = store => next => action => {
  if (!action.busy) return next(action)

  if (action.status === INITIALIZED) {
    if (!runningActions[action.busy]) {
      runningActions[action.busy] = [action.actionId]
      store.dispatch(
        setBusy(
          store
            .getState()
            .getIn(['app', 'busy'])
            .concat([action.busy]),
        ),
      )
    } else {
      runningActions[action.busy].push(action.actionId)
    }
  } else if ([COMPLETE, FAILURE].includes(action.status)) {
    if (runningActions[action.busy].length > 1) {
      runningActions[action.busy] = runningActions[action.busy].filter(id => id !== action.actionId)
    } else {
      delete runningActions[action.busy]
      store.dispatch(
        setBusy(
          store
            .getState()
            .getIn(['app', 'busy'])
            .filter(busy => busy !== action.busy),
        ),
      )
    }
  }
  return next(action)
}
