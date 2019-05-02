import { regexpValidator, validate } from '../../middleware/validate'

import { Router } from 'express'
import { checkImageAccess } from '../../middleware/authentication'
import error from '../../../utils/error'
import { getResizedImageStream } from '../../../utils/image'
import imageDb from '../../../modules/db/image'

const { internalError } = error('image-router')

const images = Router()

images.get(
  '/:id',
  validate(
    {
      params: { id: regexpValidator(/^[0-9]{1,200}$/) }
    },
    { nextOnFail: true }
  ),
  checkImageAccess,
  ({ params: { id }, query: { width, height, format, raw } }, res) => {
    const image = imageDb.get(id)
    const dimensions = {
      width: parseInt(width),
      height: parseInt(height)
    }
    const imageStream = getResizedImageStream({
      image,
      dimensions,
      format,
      raw: !!raw && raw === 'raw'
    })

    res
      .status(200)
      .contentType(
        RegExp('image/.*').test(format || '') ? format : 'image/jpeg'
      )

    imageStream.pipe(res)
    imageStream.on('error', internalError(3, 'error in image stream'))
  }
)

export default images
