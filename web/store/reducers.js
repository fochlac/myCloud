import app from './reducers/app.js'
import { combineReducers } from 'redux-immutable'
import events from './reducers/events.js'
import notes from './reducers/notes.js'
import posts from './reducers/posts.js'
import users from './reducers/users.js'

const reducers = combineReducers({
  users,
  events,
  notes,
  posts,
  app,
})

export default reducers
