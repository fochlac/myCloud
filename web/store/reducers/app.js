import { SET_BUSY, SET_HD } from '../actions'

import { Map } from 'immutable'
import { SET_FULLSCREEN } from '../actions/app'

const appReducer = (app = Map, action) => {
  switch (action.type) {
    case SET_BUSY:
      return app.set('busy', action.busy)
    case SET_HD:
      if (localStorage) {
        localStorage.hd = action.hd
      }
      return app.set('hd', action.hd)
    case SET_FULLSCREEN:
      return app.set('fullscreen', action.fullscreen)
    default:
      return app
  }
}

export default appReducer
