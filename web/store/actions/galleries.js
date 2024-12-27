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
export function createGallery({ parent = '', name, description = '', clusterThreshold }) {
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
        clusterThreshold,
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
        clusterThreshold: gallery.get('clusterThreshold'),
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

export const CREATE_TEXT_NODES = 'CREATE_TEXT_NODES'
export function createTextNode({ galleryId, type, text, dateTime }) {
  return {
    type: CREATE_TEXT_NODES,
    status: INITIALIZED,
    api: {
      url: `galleries/${galleryId}/textNodes`,
      method: 'post',
      body: {
        type, text, dateTime
      },
    },
  }
}

export const UPDATE_TEXT_NODES = 'UPDATE_TEXT_NODES'
export function updateTextNode({ galleryId, type, text, dateTime, id }) {
  return {
    type: UPDATE_TEXT_NODES,
    status: INITIALIZED,
    api: {
      url: `galleries/${galleryId}/textNodes/${id}`,
      method: 'put',
      body: {
        type,
        text,
        dateTime
      },
    },
  }
}

export const DELETE_TEXT_NODES = 'DELETE_TEXT_NODES'
export function deleteTextNode({ galleryId, id }) {
  return {
    type: DELETE_TEXT_NODES,
    status: INITIALIZED,
    api: {
      url: `galleries/${galleryId}/textNodes/${id}`,
      method: 'delete',
    }
  }
}
