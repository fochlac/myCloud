import { Router } from 'express'
import { addToAccessMap } from 'utils/jwt'
import { checkGalleryAccessToken, hasGalleryAccessToken } from 'middleware/authentication'
import error from 'utils/error'
import gallery from 'controller/gallery'
import images from './images'
import urls from './urls'
import galleryDb from 'modules/db/gallery'
const { routerError } = error('galleries-router')

const galleries = Router()

galleries.use(images)
galleries.use(urls)

galleries.get('/', (req, res) => {
  res.status(200).send(req.token && gallery.readAll(req.token.accessMap))
})
galleries.get('/:id', checkGalleryAccessToken(), ({ params: { id }, accessToken }, res) => {
  const data = gallery.read(id)
  if (accessToken.access === 'read') {
    data.urls = []
  }
  res.status(200).send({ ...data, accessToken })
})

galleries.put(
  '/:id',
  checkGalleryAccessToken(['write']),
  ({ body: { name, parent, description }, params: { id }, accessToken }, res) => {
    gallery
      .update({ name, parent, description, id })
      .then(galleries =>
        res.status(200).send(galleries.map(gallery => ({ ...gallery, accessToken }))),
      )
      .catch(routerError(2, res, 'error updating gallery', { name, parent, description, id }))
  },
)

galleries.post('/', async (req, res) => {
  const {
    body: { name, parent, description },
    token,
  } = req

  const accessToken =
    parent &&
    token &&
    galleryDb.get(parent) &&
    hasGalleryAccessToken(galleryDb.get(parent), token.accessMap)

  if (parent && !accessToken) {
    return res.status(403).send({ success: false, message: 'Kein Zugriff auf die Eltern-Gallerie' })
  }
  try {
    const galleries = await gallery.create({ name, parent, description })
    if (!parent) {
      await addToAccessMap(req, res, galleries[0].urls[0])
      galleries[0].accessToken = galleries[0].urls[0]
    } else {
    }
    res.status(200).send(galleries.map(gallery => ({ ...gallery, accessToken })))
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

export default galleries
