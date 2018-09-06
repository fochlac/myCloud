import { INITIALIZED } from '../middleware/api'

export const LOAD_GALLERIES = 'LOAD_GALLERIES'
export function loadGalleries() {
  return {
    type: LOAD_GALLERIES,
    status: INITIALIZED,
    api: {
      url: 'galleries',
      method: 'get',
    },
  }
}
