import { List, Map } from 'immutable'

export default Map({
  galleries: Map(),
  app: Map({
    busy: List(),
  }),
  uploadQueue: Map(),
  user: Map(),
})
