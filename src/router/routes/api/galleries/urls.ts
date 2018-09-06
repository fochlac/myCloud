import { Router } from 'express'
import { checkGalleryAccessToken } from 'middleware/authentication'
import error from 'utils/error'
import url from 'controller/urls'

const { routerError } = error('urls-router')

const urls = Router()

urls.post(
  '/:id/urls/',
  checkGalleryAccessToken(['write']),
  ({ params: { id }, body: { access, recursive, url } }, res) => {
    url
      .create({ gallery: id, access, recursive, url })
      .then(res.status(200).send)
      .catch(routerError(2, res, 'error creating url', { parent: id, access, recursive, url }))
  },
)
urls.put(
  '/:id/urls/:urlId',
  checkGalleryAccessToken(['write']),
  ({ params: { urlId }, body: { access, recursive, url } }, res) => {
    url
      .update({ id: urlId, access, recursive, url })
      .then(res.status(200).send)
      .catch(routerError(2, res, 'error updating url', { id: urlId, access, recursive, url }))
  },
)
urls.delete(
  '/:id/urls/:urlId',
  checkGalleryAccessToken(['write']),
  ({ params: { urlId } }, res) => {
    url
      .delete({ id: urlId })
      .then(res.status(200).send)
      .catch(routerError(2, res, 'error deleting url', { id: urlId }))
  },
)

export default urls
