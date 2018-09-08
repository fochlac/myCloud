import { Router } from 'express'
import { addToAccessMap } from 'utils/jwt'
import { checkGalleryAccessToken } from 'middleware/authentication'
import error from 'utils/error'
import gallery from 'controller/gallery'
import images from './images'
import urls from './urls'
const { routerError } = error('galleries-router')

const galleries = Router()

galleries.get('/', (req, res) => {
  res.status(200).send(req.token && gallery.readAll(req.token.accessMap))
})
galleries.get(
  '/:id',
  checkGalleryAccessToken(),
  ({ params: { id }, accessToken: { access } }, res) => {
    const data = gallery.read(id)
    if (access === 'read') {
      data.urls = []
    }
    res.status(200).send(data)
  },
)

galleries.put(
  '/:id',
  checkGalleryAccessToken(['write']),
  ({ body: { name, parent, description }, params: { id } }, res) => {
    gallery
      .update({ name, parent, description, id })
      .then(newGallery => res.status(200).send(newGallery))
      .catch(routerError(2, res, 'error updating gallery', { name, parent, description, id }))
  },
)

galleries.post('/', async (req, res) => {
  const {
    body: { name, parent, description },
  } = req
  try {
    const galleries = await gallery.create({ name, parent, description })
    await addToAccessMap(req, res, galleries.find(({id}) => id !== parent).urls[0])
    res.status(200).send(galleries)
  } catch (error) {
    routerError(2, res, 'error creating new gallery', { name, parent, description })(error)
  }
})

galleries.delete('/:id', checkGalleryAccessToken(['write']), ({ params: { id } }, res) => {
  gallery
    .delete(id)
    .then(id => res.status(200).send(id))
    .catch(routerError(2, res, 'error deleting gallery', id))
})

galleries.use(images)
galleries.use(urls)

export default galleries
