import { COMPLETE } from '../middleware/api'
import { LOAD_GALLERIES } from '../actions/galleries.ts'
import { Map } from 'immutable'

const galleriesReducer = (galleries = Map, action) => {
  switch (action.type) {
    case LOAD_GALLERIES:
      return action.status === COMPLETE ? Map(action.data.map(v => [v.get('id'), v])) : galleries
    default:
      return galleries
  }
}

export default galleriesReducer
