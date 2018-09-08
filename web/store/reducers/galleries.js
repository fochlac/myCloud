import { COMPLETE } from '../middleware/api'
import { LOAD_GALLERIES, CREATE_GALLERY, UPDATE_GALLERY } from '../actions'
import { Map } from 'immutable'

const galleriesReducer = (galleries = Map, action) => {
  switch (action.type) {
    case LOAD_GALLERIES:
      return action.status === COMPLETE ? Map(action.data.map(v => [v.get('id'), v])) : galleries
    case CREATE_GALLERY:
    case UPDATE_GALLERY:
      if (action.status === COMPLETE) {
        action.data.forEach(gallery => (galleries = galleries.set(gallery.get('id'), gallery)))
      }
      return galleries
    default:
      return galleries
  }
}

export default galleriesReducer
