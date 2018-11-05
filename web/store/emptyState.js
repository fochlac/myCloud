import { List, Map } from 'immutable'

export default Map({
  galleries: Map(),
  app: Map({
    busy: List(),
    hd: !localStorage || (localStorage.hd !== 'false' && true),
  }),
  uploadQueue: Map(),
  user: Map(),
})
