import { Map } from 'immutable'
import { LOGIN, REGISTER } from '../actions'
import { COMPLETE } from '../middleware/api'

const appReducer = (app = Map, action) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      if (action.status === COMPLETE) {
        return action.data
      }
      return app
    default:
      return app
  }
}

export default appReducer
