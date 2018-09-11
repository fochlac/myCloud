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
export function createGallery({ parent = '', name, description = '' }) {
  return {
    type: CREATE_GALLERY,
    status: INITIALIZED,
    api: {
      url: 'galleries',
      method: 'post',
      body: {
        parent,
        name,
        description,
      },
    },
  }
}

export const UPDATE_GALLERY = 'UPDATE_GALLERY'
export function updateGallery(gallery) {
  return {
    type: UPDATE_GALLERY,
    status: INITIALIZED,
    api: {
      url: `galleries/${gallery.get('id')}`,
      method: 'put',
      body: {
        parent: gallery.get('parent'),
        name: gallery.get('name'),
        description: gallery.get('description'),
      },
    },
  }
}

export const DELETE_GALLERY = 'DELETE_GALLERY'
export function deleteGallery(id) {
  return {
    type: DELETE_GALLERY,
    status: INITIALIZED,
    api: {
      url: `galleries/${id}`,
      method: 'delete',
    },
  }
}

export const CREATE_URL = 'CREATE_URL'
export function createUrl({ gallery, url, access }) {
  return {
    type: CREATE_URL,
    status: INITIALIZED,
    api: {
      url: `galleries/${gallery}/urls`,
      method: 'post',
      body: {
        url,
        access,
      },
    },
  }
}

export const DELETE_URL = 'DELETE_URL'
export function deleteUrl(gallery, id) {
  return {
    type: DELETE_URL,
    status: INITIALIZED,
    api: {
      url: `galleries/${gallery}/urls/${id}`,
      method: 'delete',
    },
    payload: {
      gallery,
    },
  }
}
