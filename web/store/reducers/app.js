import { SET_BUSY, SET_HD } from '../actions'

import { Map } from 'immutable'

const appReducer = (app = Map, action) => {
  switch (action.type) {
    case SET_BUSY:
      return app.set('busy', action.busy)
    case SET_HD:
      return app.set('hd', action.hd)
    default:
      return app
  }
}

export default appReducer
