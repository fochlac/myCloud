import app from './reducers/app.js'
import uploadQueue from './reducers/uploadQueue.js'
import { combineReducers } from 'redux-immutable'
import galleries from './reducers/galleries.js'
import user from './reducers/user.js'

const reducers = combineReducers({
  uploadQueue,
  app,
  galleries,
  user,
})

export default reducers
