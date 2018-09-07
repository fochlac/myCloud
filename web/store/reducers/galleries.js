import { COMPLETE } from '../middleware/api'
import { LOAD_GALLERIES } from '../actions'
import { Map } from 'immutable'
import { CREATE_GALLERY } from '../actions';

const galleriesReducer = (galleries = Map, action) => {
  switch (action.type) {
    case LOAD_GALLERIES:
      return action.status === COMPLETE ? Map(action.data.map(v => [v.get('id'), v])) : galleries
    case CREATE_GALLERY:
      return action.status === COMPLETE ? galleries.set(action.data.get('id'), action.data) : galleries
    default:
      return galleries
  }
}

export default galleriesReducer
