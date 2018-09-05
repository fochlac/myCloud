import { Router } from 'express'
import error from 'utils/error'
import image from 'controller/images'
import imageStore from 'middleware/images'

const { routerError } = error('images-router')

const images = Router()

images.post(
  '/:id/images/',
  imageStore.single('image'),
  ({ params: { id }, body: { name, description }, file }, res) => {
    console.log('test')
    image
      .create({ gallery: id, name, description, file })
      .then(image => res.status(200).send(image))
      .catch(routerError(2, res, 'error creating image', { parent: id, name, description }))
  },
)
images.put(
  '/:id/images/:imageId',
  imageStore.single('image'),
  ({ params: { imageId, id }, body: { name, description } }, res) => {
    image
      .update({ id: imageId, name, description, gallery: id })
      .then(image => res.status(200).send(image))
      .catch(routerError(2, res, 'error updating image', { id: imageId, name, description }))
  },
)
images.delete('/:id/images/:imageId', ({ params: { imageId } }, res) => {
  image
    .delete({ id: imageId })
    .then(id => res.status(200).send(id))
    .catch(routerError(2, res, 'error deleting image', { id: imageId }))
})

export default images
