import app from './reducers/app.js'
import { combineReducers } from 'redux-immutable'
import galleries from './reducers/galleries.js'

const reducers = combineReducers({
  app,
  galleries,
})

export default reducers
