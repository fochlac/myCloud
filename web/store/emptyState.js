import { List, Map } from 'immutable'

const hd = localStorage.hd !== undefined ? localStorage.hd : true

export default Map({
  galleries: Map(),
  app: Map({
    busy: List(),
    hd,
  }),
  uploadQueue: Map(),
  user: Map(),
})
