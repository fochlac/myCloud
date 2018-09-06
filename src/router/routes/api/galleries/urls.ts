import { Create, Delete, Update } from 'controller/urls'

import { Router } from 'express'
import { checkGalleryAccessToken } from 'middleware/authentication'
import error from 'utils/error'

const { routerError } = error('urls-router')

const urls = Router()

urls.post(
  '/:id/urls/',
  checkGalleryAccessToken(['write']),
  ({ params: { id }, body: { access, recursive, url } }, res) => {
    Create({ gallery: id, access, recursive, url })
      .then(url => res.status(200).send(url))
      .catch(routerError(2, res, 'error creating url', { parent: id, access, recursive, url }))
  },
)
urls.put(
  '/:id/urls/:urlId',
  checkGalleryAccessToken(['write']),
  ({ params: { urlId }, body: { access, recursive, url } }, res) => {
    Update({ id: urlId, access, recursive, url })
      .then(url => res.status(200).send(url))
      .catch(routerError(2, res, 'error updating url', { id: urlId, access, recursive, url }))
  },
)
urls.delete(
  '/:id/urls/:urlId',
  checkGalleryAccessToken(['write']),
  ({ params: { urlId } }, res) => {
    Delete(urlId)
      .then(id => res.status(200).send(id))
      .catch(routerError(2, res, 'error deleting url', { id: urlId }))
  },
)

export default urls
