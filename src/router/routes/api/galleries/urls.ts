import { Create, Delete, Update } from '../../../controller/urls'

import { Router } from 'express'
import { checkGalleryAccessToken } from '../../../middleware/authentication'
import error from '../../../../utils/error'
import { randomUrl } from '../../../../utils/url'
import { regexpValidator, validate, oneOfValidator } from '../../../middleware/validate'

const { routerError } = error('urls-router')

const urls = Router()

urls.post(
  '/:id/urls/',
  validate(
    {
      params: { id: regexpValidator(/^[0-9]{1,200}$/) },
    },
    { nextOnFail: true },
  ),
  checkGalleryAccessToken(['write']),
  validate(
    {
      body: {
        access: oneOfValidator(['read', 'write'], true),
        url: regexpValidator(/^[0-9a-zA-z\_\-]{1,200}$/, true),
      },
    },
    { nextOnFail: false },
  ),
  ({ params: { id }, body: { access = 'read', recursive = true, url = randomUrl() } }, res) => {
    Create({ gallery: id, access, recursive, url })
      .then(url => res.status(200).send(url))
      .catch(routerError(2, res, 'error creating url', { parent: id, access, recursive, url }))
  },
)
// urls.put(
//   '/:id/urls/:urlId',
//   validate(
//     {
//       params: { id: regexpValidator(/^[0-9]{1,200}$/), urlId: regexpValidator(/^[0-9]{1,200}$/) },
//     },
//     { nextOnFail: true },
//   ),
//   checkGalleryAccessToken(['write']),
//   ({ params: { urlId }, body: { access, recursive, url } }, res) => {
//     Update({ id: urlId, access, recursive, url })
//       .then(url => res.status(200).send(url))
//       .catch(routerError(2, res, 'error updating url', { id: urlId, access, recursive, url }))
//   },
// )
urls.delete(
  '/:id/urls/:urlId',
  validate(
    {
      params: { id: regexpValidator(/^[0-9]{1,200}$/), urlId: regexpValidator(/^[0-9]{1,200}$/) },
    },
    { nextOnFail: true },
  ),
  checkGalleryAccessToken(['write']),
  ({ params: { urlId } }, res) => {
    Delete(urlId)
      .then(id => res.status(200).send(id))
      .catch(routerError(2, res, 'error deleting url', { id: urlId }))
  },
)

export default urls
