import { Router } from 'express'
import { checkGalleryAccessToken } from '../../../middleware/authentication'
import { regexpValidator, oneOfValidator, validate } from '../../../middleware/validate'
import error from '../../../../utils/error'
import textNodesController from '../../../controller/textNodes'

const { routerError } = error('textNodes-router')
const textNodes = Router()

textNodes.post(
  '/:id/textNodes',
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
        text: regexpValidator(/^.{0,2000}$/),
        type: oneOfValidator(['description', 'title']),
        dateTime: regexpValidator(/^[0-9]{1,20}$/, true),
      },
    },
    { nextOnFail: false },
  ),
  ({ params: { id }, body: { text, type, dateTime } }, res) => {
    textNodesController.create({ id, text, type, dateTime })
      .then(textNode => res.status(200).send(textNode))
      .catch(routerError(2, res, 'error creating text node', { galleryId: id, text, type }))
  }
)

textNodes.put(
  '/:id/textNodes/:nodeId',
  validate(
    {
      params: {
        id: regexpValidator(/^[0-9]{1,200}$/),
        nodeId: regexpValidator(/^[0-9]{1,200}$/),
      },
    },
    { nextOnFail: true },
  ),
  checkGalleryAccessToken(['write']),
  validate(
    {
      body: {
        text: regexpValidator(/^.{0,2000}$/),
        type: oneOfValidator(['description', 'title']),
        dateTime: regexpValidator(/^[0-9]{1,20}$/, true),
      },
    },
    { nextOnFail: false },
  ),
  ({ params: { nodeId }, body: { text, type, dateTime } }, res) => {
    textNodesController.update({ nodeId, text, type, dateTime })
      .then(textNode => res.status(200).send(textNode))
      .catch(routerError(2, res, 'error updating text node', { id: nodeId, text, type }))
  }
)

textNodes.delete(
  '/:id/textNodes/:nodeId',
  validate(
    {
      params: {
        id: regexpValidator(/^[0-9]{1,200}$/),
        nodeId: regexpValidator(/^[0-9]{1,200}$/),
      },
    },
    { nextOnFail: true },
  ),
  checkGalleryAccessToken(['write']),
  ({ params: { id: galleryId, nodeId } }, res) => {
    textNodesController.delete({ galleryId, nodeId })
      .then(() => res.status(200).send({ id: nodeId, galleryId }))
      .catch(routerError(2, res, 'error deleting text node', { id: nodeId }))
  }
)

export default textNodes
