import { INITIALIZED } from '../middleware/api'

export const DELETE_IMAGE = 'DELETE_IMAGE'
export function deleteImage(image) {
  return {
    type: DELETE_IMAGE,
    status: INITIALIZED,
    api: {
      method: 'delete',
      url: `galleries/${image.get('gallery')}/images/${image.get('id')}`,
    },
  }
}

export const UPDATE_IMAGE = 'UPDATE_IMAGE'
export function updateImage(image) {
  return {
    type: UPDATE_IMAGE,
    status: INITIALIZED,
    api: {
      method: 'put',
      url: `galleries/${image.get('gallery')}/images/${image.get('id')}`,
      body: image.toJS(),
    },
  }
}

export const ROTATE_IMAGE = 'ROTATE_IMAGE'
export function rotateImage(image, direction = 'right') {
  return {
    type: ROTATE_IMAGE,
    status: INITIALIZED,
    api: {
      method: 'post',
      url: `galleries/${image.get('gallery')}/images/${image.get('id')}/rotate`,
      body: {
        direction,
      },
    },
  }
}

export const CREATE_IMAGE = 'CREATE_IMAGE'
export function createImage(image, parent) {
  return {
    type: CREATE_IMAGE,
    status: INITIALIZED,
    api: {
      headers: 'formdata',
      method: 'post',
      url: `galleries/${parent}/images/`,
      body: formDataFromObject({
        image: image.file,
        rotate: image.rotate ?? 0,
        name: image.name,
        imageTaken: image.imageTaken,
        created: image.created,
      }),
    },
    payload: {
      image,
      galleryId: parent,
    },
  }
}

export const formDataFromObject = data => {
  let formData = new FormData()

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })

  return formData
}
