import { COMPLETE } from '../middleware/api'
import {
  LOAD_GALLERIES,
  CREATE_GALLERY,
  UPDATE_GALLERY,
  CREATE_IMAGE,
  UPDATE_IMAGE,
  DELETE_IMAGE,
  DELETE_GALLERY,
  DELETE_URL,
  CREATE_URL,
} from '../actions'
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
    case DELETE_GALLERY:
      if (action.status === COMPLETE) {
        const id = action.data.toString()
        const parentId = galleries.getIn([id, 'parent'])
        galleries = removeGalleryRecursively(galleries, id)
        galleries = parentId
          ? galleries.updateIn([parentId, 'children'], children => {
              return children.filter(childId => childId !== id)
            })
          : galleries
      }
      return galleries
    case CREATE_IMAGE:
      if (action.status === COMPLETE) {
        const image = action.data
        galleries = galleries.updateIn([image.get('gallery'), 'images'], images =>
          images.push(image),
        )
      }
      return galleries
    case UPDATE_IMAGE:
      if (action.status === COMPLETE) {
        const image = action.data

        galleries = galleries.updateIn([image.get('gallery'), 'images'], images => {
          const position = images.findIndex(img => img.get('id') === image.get('id'))
          return images.set(position, image)
        })
      }
      return galleries
    case DELETE_IMAGE:
      if (action.status === COMPLETE) {
        const { data } = action

        galleries = galleries.updateIn([data.get('gallery'), 'images'], images => {
          return images.filter(image => image.get('id') !== data.get('id'))
        })
      }
      return galleries
    case DELETE_URL:
      if (action.status === COMPLETE) {
        const {
          data,
          payload: { gallery },
        } = action
        const id = data.toString()

        galleries = galleries.updateIn([gallery, 'urls'], urls => {
          return urls.filter(url => url.get('id') !== id)
        })
      }
      return galleries
    case CREATE_URL:
      if (action.status === COMPLETE) {
        const { data } = action

        galleries = galleries.updateIn([data.get('gallery'), 'urls'], urls => {
          return urls.push(data)
        })
      }
      return galleries
    default:
      return galleries
  }
}

export default galleriesReducer

function removeGalleryRecursively(galleries, id) {
  const gallery = galleries.get(id)
  galleries = gallery.get('children').reduce(removeGalleryRecursively, galleries)
  return galleries.delete(id)
}
