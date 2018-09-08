import { INITIALIZED } from '../middleware/api'

export const LOAD_GALLERIES = 'LOAD_GALLERIES'
export function loadGalleries() {
  return {
    type: LOAD_GALLERIES,
    status: INITIALIZED,
    busy: 'APP_ROOT',
    api: {
      url: 'galleries',
      method: 'get',
    },
  }
}

export const CREATE_GALLERY = 'CREATE_GALLERY'
export function createGallery({parent = '', name, description = ''}) {
  return {
    type: CREATE_GALLERY,
    status: INITIALIZED,
    api: {
      url: 'galleries',
      method: 'post',
      body: {
        parent,
        name,
        description
      }
    }
  }
}

