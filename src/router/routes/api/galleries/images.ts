import { Router } from 'express'
import image from 'CONTROLLER/images'
import error from 'SERVER/utils/error'

const { routerError } = error('images-router')

const images = Router()

images.post('/',
  image.single('imageData'),
  ({ params: { id }, body: { name, description } }, res) => {
    image.create({ parent: id, name, description })
      .then(res.status(200).send)
      .catch(routerError(2, res, 'error creating image', { parent: id, name, description }))
  }
)
images.put('/:imageId', ({ params: { imageId }, body: { name, description } }, res) => {
  image.update({ id: imageId, name, description })
    .then(res.status(200).send)
    .catch(routerError(2, res, 'error updating image', { id: imageId, name, description }))
})
images.delete('/:imageId', ({ params: { imageId } }, res) => {
  image.delete({ id: imageId })
    .then(res.status(200).send)
    .catch(routerError(2, res, 'error deleting image', { id: imageId }))
})

export default images
