import { INIT, SET_BUSY, SET_HD } from '../actions'

import { Map } from 'immutable'

const appReducer = (app = Map, action) => {
  console.log(action)
  switch (action.type) {
    case INIT:
      return app.set('hd', !localStorage || (localStorage.hd !== 'false' && true))
    case SET_BUSY:
      return app.set('busy', action.busy)
    case SET_HD:
      if (localStorage) {
        localStorage.hd = action.hd
      }
      return app.set('hd', action.hd)
    default:
      return app
  }
}

export default appReducer
