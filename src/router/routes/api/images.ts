import { regexpValidator, validate } from '../../middleware/validate'

import { Router } from 'express'
import { checkImageAccess } from '../../middleware/authentication'
import { getResizedImageStream } from '../../../utils/image'
import imageDb from '../../../modules/db/image'

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

    res
      .status(200)
      .contentType(format || 'image/jpeg')

    imageStream.pipe(res)
})

export default images
