import { oneOfValidator, regexpValidator, validate } from '../../../middleware/validate'

import { Router } from 'express'
import { checkGalleryAccessToken } from '../../../middleware/authentication'
import error from '../../../../utils/error'
import image from '../../../controller/images'
import imageStore from '../../../middleware/images'

const { routerError } = error('images-router')

const images = Router()

images.post(
  '/:id/images',
  validate(
    {
      params: { id: regexpValidator(/^[0-9]{1,200}$/) },
    },
    { nextOnFail: true },
  ),
  checkGalleryAccessToken(['write']),
  imageStore.single('image'),
  validate(
    {
      body: {
        name: regexpValidator(/^.{1,100}$/),
        description: regexpValidator(/^.{1,2000}$/, true),
        created: regexpValidator(/^[0-9]{1,20}$/, true),
        imageTaken: regexpValidator(/^[0-9]{1,20}$/, true),
        rotate: oneOfValidator(['0', '90', '180', '270'], true),
      },
    },
    { nextOnFail: false },
  ),
  ({ params: { id }, body: { name, description, created, imageTaken, rotate }, file }, res) => {
    image
      .create({ gallery: id, name, description, file, created, imageTaken, rotate })
      .then(image => res.status(200).send(image))
      .catch(routerError(2, res, 'error creating image', { parent: id, name, description }))
  },
)
images.put(
  '/:id/images/:imageId',
  validate(
    {
      params: { id: regexpValidator(/^[0-9]{1,200}$/), imageId: regexpValidator(/^[0-9]{1,200}$/) },
    },
    { nextOnFail: true },
  ),
  checkGalleryAccessToken(['write']),
  validate(
    {
      body: {
        name: regexpValidator(/^.{1,100}$/),
        description: regexpValidator(/^.{1,2000}$/, true),
      },
    },
    { nextOnFail: false },
  ),
  imageStore.single('image'),
  ({ params: { imageId, id }, body: { name, description } }, res) => {
    image
      .update({ id: imageId, name, description, gallery: id })
      .then(image => res.status(200).send(image))
      .catch(routerError(2, res, 'error updating image', { id: imageId, name, description }))
  },
)
images.delete(
  '/:id/images/:imageId',
  validate(
    {
      params: { id: regexpValidator(/^[0-9]{1,200}$/), imageId: regexpValidator(/^[0-9]{1,200}$/) },
    },
    { nextOnFail: true },
  ),
  checkGalleryAccessToken(['write']),
  ({ params: { imageId, id } }, res) => {
    image
      .delete({ gallery: id, id: imageId })
      .then(imageId => res.status(200).send({ gallery: id, id: imageId }))
      .catch(routerError(2, res, 'error deleting image', { id: imageId }))
  },
)

images.post(
  '/:id/images/:imageId/rotate',
  validate(
    {
      params: { id: regexpValidator(/^[0-9]{1,200}$/), imageId: regexpValidator(/^[0-9]{1,200}$/) },
    },
    { nextOnFail: true },
  ),
  checkGalleryAccessToken(['write']),
  validate(
    {
      body: { direction: oneOfValidator(['left', 'right']) },
    },
    { nextOnFail: false },
  ),
  async ({ params: { imageId }, body: { direction } }, res) => {
    image
      .rotate({ id: imageId, direction })
      .then(image => res.status(200).send(image))
      .catch(routerError(2, res, 'error rotating image', { id: imageId, direction }))
  },
)

export default images
