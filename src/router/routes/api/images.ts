import { regexpValidator, validate } from '../../middleware/validate'

import { Router } from 'express'
import { checkImageAccess } from '../../middleware/authentication'
import error from '../../../utils/error'
import { getResizedImageStream } from '../../../utils/image'
import imageDb from '../../../modules/db/image'

const { routerError } = error('image-router')

const images = Router()

images.get(
  '/:id',
  validate(
    {
      params: { id: regexpValidator(/^[0-9]{1,200}$/) },
    },
    { nextOnFail: true },
  ),
  checkImageAccess,
  ({ params: { id }, query: { width, height, format, raw } }, res) => {
    const image = imageDb.get(id)
    const dimensions = {
      width: parseInt(width),
      height: parseInt(height),
    }
    const imageStream = getResizedImageStream({
      image,
      dimensions,
      format,
      raw: !!raw && raw === 'raw',
    })
    imageStream.on('error', routerError(3, res, 'failure getting image'))

    res
      .status(200)
      .contentType(format || 'image/jpeg')

    imageStream.pipe(res)

})

export default images
