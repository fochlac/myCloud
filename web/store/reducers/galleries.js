import {
  CREATE_GALLERY,
  CREATE_IMAGE,
  CREATE_TEXT_NODES,
  CREATE_URL,
  DELETE_GALLERY,
  DELETE_IMAGE,
  DELETE_TEXT_NODES,
  DELETE_URL,
  LOAD_GALLERIES,
  ROTATE_IMAGE,
  UPDATE_GALLERY,
  UPDATE_IMAGE,
  UPDATE_TEXT_NODES,
} from '../actions'

import { COMPLETE } from '../middleware/api'
import { List, Map } from 'immutable'

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
      case CREATE_TEXT_NODES:
        if (action.status === COMPLETE) {
          const node = action.data
          galleries = galleries.updateIn([node.get('galleryId'), 'textNodes'], nodes =>
            !!nodes ? nodes.push(node) : new List([node])
          )
        }
        return galleries
      case UPDATE_TEXT_NODES:
        if (action.status === COMPLETE) {
          const node = action.data

          galleries = galleries.updateIn([node.get('galleryId'), 'textNodes'], nodes => {
            const position = nodes.findIndex(tn => tn.get('id') === node.get('id'))
            return nodes.set(position, node)
          })
        }
        return galleries
      case DELETE_TEXT_NODES:
        if (action.status === COMPLETE) {
          const { data } = action

          galleries = galleries.updateIn([data.get('galleryId'), 'textNodes'], nodes => {
            return nodes.filter(tn => tn.get('id') !== data.get('id'))
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
