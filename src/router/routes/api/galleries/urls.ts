import { Router } from 'express'
import url from 'CONTROLLER/urls'
import error from 'SERVER/utils/error'

const { routerError } = error('urls-router')

const urls = Router()

urls.post('/', ({ params: { id }, body: { access, recursive } }, res) => {
  url.create({ parent: id, access, recursive })
    .then(res.status(200).send)
    .catch(routerError(2, res, 'error creating url', { parent: id, access, recursive }))
})
urls.put('/:urlId', ({ params: { urlId }, body: { access, recursive } }, res) => {
  url.update({ id: urlId, access, recursive })
    .then(res.status(200).send)
    .catch(routerError(2, res, 'error updating url', { id: urlId, access, recursive }))
})
urls.delete('/:urlId', ({ params: { urlId } }, res) => {
  url.delete({ id: urlId })
    .then(res.status(200).send)
    .catch(routerError(2, res, 'error deleting url', { id: urlId }))
})

export default urls
