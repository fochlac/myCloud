import { Router } from 'express'
import error from 'SERVER/utils/error'
import gallery from 'CONTROLLER/gallery'
import images from './images'
import urls from './urls'
const { routerError } = error('galleries-router')

const galleries = Router()

galleries.get('/', (req, res) => {
  res.status(200).send(gallery.readAll())
})
galleries.get('/:id', ({ params: { id } }, res) => {
  res.status(200).send(gallery.read(id))
})

galleries.put('/:id', ({ body: { name, parent, description }, params: { id } }, res) => {
  gallery
    .update({ name, parent, description, id })
    .then(newGallery => res.status(200).send(newGallery))
    .catch(routerError(2, res, 'error updating gallery', { name, parent, description, id }))
})

galleries.post('/', ({ body: { name, parent, description } }, res) => {
  gallery
    .create({ name, parent, description })
    .then(newGallery => res.status(200).send(newGallery))
    .catch(routerError(2, res, 'error creating new gallery', { name, parent, description }))
})

galleries.delete('/:id', ({ params: { id } }, res) => {
  gallery
    .delete(id)
    .then(id => res.status(200).send(id))
    .catch(routerError(2, res, 'error deleting gallery', id))
})

galleries.use('/:id/images', images)
galleries.use('/:id/urls', urls)

export default galleries
