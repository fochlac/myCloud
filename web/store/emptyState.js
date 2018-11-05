import { List, Map } from 'immutable'

export default Map({
  galleries: Map(),
  app: Map({
    busy: List(),
    hd: true,
  }),
  uploadQueue: Map(),
  user: Map(),
})
