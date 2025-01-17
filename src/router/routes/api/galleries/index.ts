import { checkGalleryAccessToken, getGalleryAccessToken } from '../../../middleware/authentication'
import { regexpValidator, validate } from '../../../middleware/validate'

import { Router } from 'express'
import { addToAccessMap } from '../../../../utils/jwt'
import error from '../../../../utils/error'
import gallery from '../../../controller/gallery'
import galleryDb from '../../../../modules/db/gallery'
import images from './images'
import logger from '../../../../utils/logger'
import urls from './urls'
import userDb from '../../../../modules/db/user'
import textNodes from './textNodes'

const log = (level, ...message) => logger(level, 'api/gallery/index.ts -', ...message)

const { routerError } = error('galleries-router')

const galleries = Router()

galleries.use(images)
galleries.use(urls)
galleries.use(textNodes)

galleries.get('/', (req, res) => {
  res.status(200).send(gallery.ReadAll(req.token && req.token.accessMap))
})
galleries.get(
  '/:id',
  validate({ params: { id: regexpValidator(/^[0-9]{1,200}$/) } }, { nextOnFail: true }),
  checkGalleryAccessToken(),
  ({ params: { id }, accessToken }, res) => {
    const data = gallery.Read(id)
    if (['read', 'timeline'].includes(accessToken.access)) {
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
        clusterThreshold: regexpValidator(/^[0-9]{1,2}$/, true),
      },
    },
    { nextOnFail: false },
  ),
  ({ body: { name, parent, description, clusterThreshold }, params: { id }, accessToken }, res) => {
    gallery
      .Update({ name, parent, description, id, clusterThreshold })
      .then(galleries =>
        res.status(200).send(galleries.map(gallery => ({ ...gallery, accessToken }))),
      )
      .catch(routerError(2, res, 'error updating gallery', { name, parent, description, id, clusterThreshold }))
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
        clusterThreshold: regexpValidator(/^[0-9]{1,3}$/, true),
      },
    },
    { nextOnFail: false },
  ),
  async (req, res) => {
    const {
      body: { name, parent, description, clusterThreshold },
      token,
    } = req

    const accessToken =
      parent &&
      token &&
      galleryDb.getBare(parent) &&
      getGalleryAccessToken(galleryDb.getBare(parent), token.accessMap)

    if (parent && !accessToken) {
      log(4, 'cannot create gallery since user lacks the access rights for the parent gallery')
      return res
        .status(403)
        .send({ success: false, message: 'Kein Zugriff auf die Eltern-Gallerie' })
    }
    try {
      let galleries = await gallery.Create({ name, parent, description, clusterThreshold })
      if (!parent) {
        await addToAccessMap(req, res, galleries[0].urls[0])
        if (req.user) {
          await userDb.addUserUrl(req.user.id, galleries[0].urls[0])
        }
        galleries[0].accessToken = galleries[0].urls[0]
      } else {
        galleries = galleries.map(gallery => ({ ...gallery, accessToken }))
      }
      res.status(200).send(galleries)
    } catch (error) {
      routerError(2, res, 'error creating new gallery', { name, parent, description, clusterThreshold })(error)
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
