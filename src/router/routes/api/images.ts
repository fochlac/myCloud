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
      width: parseInt(width as string),
      height: parseInt(height as string),
    }
    const imageStream = getResizedImageStream({
      image,
      dimensions,
      raw: !!raw && raw === 'raw'
    })

    res
      .status(200)
      .setHeader('Content-Encoding', 'gzip')

    res.contentType(
        RegExp('image/.*').test(format as string || '') ? format as string : 'image/jpeg'
      )

    imageStream.pipe(res)
    imageStream.on('error', internalError(3, 'error in image stream'))
  }
)

export default images
