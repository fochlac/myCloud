import { Map } from 'immutable'
import { UPDATE_QUEUE, CREATE_IMAGE } from '../actions'
import { COMPLETE, FAILURE } from '../middleware/api'

const updateQueueReducer = (updateQueue = Map, action) => {
  switch (action.type) {
    case UPDATE_QUEUE:
      return updateQueue.merge(action.partial)
    case CREATE_IMAGE:
      if (action.status === COMPLETE) {
        updateQueue = updateQueue.updateIn([action.payload.galleryId, 'images'], images => {
          return images.filter(image => image.get('id') !== action.payload.image.id)
        })
      } else if (action.status === FAILURE) {
        const position = updateQueue
          .getIn([action.payload.galleryId, 'images'])
          .findIndex(image => image.get('id') === action.payload.image.id)
        updateQueue = updateQueue.updateIn(
          [action.payload.galleryId, 'images', position],
          image => {
            return image.merge({ uploadingFailed: true, isUploading: false })
          },
        )
      }
      return updateQueue
    default:
      return updateQueue
  }
}

export default updateQueueReducer
