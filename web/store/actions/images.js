import { INITIALIZED } from "../middleware/api";

const DELETE_IMAGE = 'DELETE_IMAGE'
export function deleteImage(image) {
  return {
    type: DELETE_IMAGE,
    status: INITIALIZED,
    api: {
      method: 'delete',
      url: `galleries/${image.get('gallery')}/images/${image.get('id')}`
    }
  }
}

const UPDATE_IMAGE = 'UPDATE_IMAGE'
export function updateImage(image) {
  return {
    type: UPDATE_IMAGE,
    status: INITIALIZED,
    api: {
      method: 'put',
      url: `galleries/${image.get('gallery')}/images/${image.get('id')}`,
      body: image.toJS()
    }
  }
}

const CREATE_IMAGE = 'CREATE_IMAGE'
export function createImage(file, parent) {
  return {
    type: CREATE_IMAGE,
    status: INITIALIZED,
    api: {
      headers: 'formdata',
      method: 'put',
      url: `galleries/${parent}/images/)}`,
      body: formDataFromObject({
        image: null,
        name: file.name
      })
    }
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
