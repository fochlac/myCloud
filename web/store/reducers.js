import app from './reducers/app.js'
import uploadQueue from './reducers/uploadQueue.js'
import { combineReducers } from 'redux-immutable'
import galleries from './reducers/galleries.js'

const reducers = combineReducers({
  uploadQueue,
  app,
  galleries,
})

export default reducers
