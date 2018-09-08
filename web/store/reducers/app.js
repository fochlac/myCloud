import { Map } from 'immutable'
import { SET_BUSY } from '../actions';

const appReducer = (app = Map, action) => {
  switch (action.type) {
    case SET_BUSY:
      return app.set('busy', action.busy)
    default:
      return app
  }
}

export default appReducer
