import { Router } from 'express'
import { addToAccessMap } from '../../../../utils/jwt'
import { checkGalleryAccessToken, hasGalleryAccessToken } from '../../../middleware/authentication'
import error from '../../../../utils/error'
import gallery from '../../../controller/gallery'
import images from './images'
import urls from './urls'
import galleryDb from '../../../../modules/db/gallery'
import { validate, regexpValidator } from '../../../middleware/validate'
const { routerError } = error('galleries-router')

const galleries = Router()

galleries.use(images)
galleries.use(urls)

galleries.get('/', (req, res) => {
  res.status(200).send(req.token && gallery.ReadAll(req.token.accessMap))
})
galleries.get(
  '/:id',
  validate({ params: { id: regexpValidator(/^[0-9]{1,200}$/) } }, { nextOnFail: true }),
  checkGalleryAccessToken(),
  ({ params: { id }, accessToken }, res) => {
    const data = gallery.Read(id)
    if (accessToken.access === 'read') {
      data.urls = []
    }
    res.status(200).send({ ...data, accessToken })
  },
)

galleries.put(
  '/:id',
  validate({ params: { id: regexpValidator(/^[0-9]{1,200}$/) } }, { nextOnFail: true }),
  checkGalleryAccessToken(['write']),
  validate(
    {
      body: {
        name: regexpValidator(/^.{1,100}$/),
        parent: regexpValidator(/^[0-9]{1,200}$/, true),
        description: regexpValidator(/^.{1,2000}$/, true),
      },
    },
    { nextOnFail: false },
  ),
  ({ body: { name, parent, description }, params: { id }, accessToken }, res) => {
    gallery
      .Update({ name, parent, description, id })
      .then(galleries =>
        res.status(200).send(galleries.map(gallery => ({ ...gallery, accessToken }))),
      )
      .catch(routerError(2, res, 'error updating gallery', { name, parent, description, id }))
  },
)

galleries.post(
  '/',
  validate(
    {
      body: {
        name: regexpValidator(/^.{1,100}$/),
        parent: regexpValidator(/^[0-9]{1,200}$/, true),
        description: regexpValidator(/^.{1,2000}$/, true),
      },
    },
    { nextOnFail: false },
  ),
  async (req, res) => {
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
      return res
        .status(403)
        .send({ success: false, message: 'Kein Zugriff auf die Eltern-Gallerie' })
    }
    try {
      let galleries = await gallery.Create({ name, parent, description })
      if (!parent) {
        await addToAccessMap(req, res, galleries[0].urls[0])
        galleries[0].accessToken = galleries[0].urls[0]
        console.log('called', galleries[0].urls[0])
      } else {
        galleries = galleries.map(gallery => ({ ...gallery, accessToken }))
      }
      res.status(200).send(galleries)
    } catch (error) {
      routerError(2, res, 'error creating new gallery', { name, parent, description })(error)
    }
  },
)

galleries.delete(
  '/:id',
  validate({ params: { id: regexpValidator(/^[0-9]{1,200}$/) } }, { nextOnFail: true }),
  checkGalleryAccessToken(['write']),
  ({ params: { id } }, res) => {
    gallery
      .Delete(id)
      .then(id => res.status(200).send(id))
      .catch(routerError(2, res, 'error deleting gallery', id))
  },
)

export default galleries
