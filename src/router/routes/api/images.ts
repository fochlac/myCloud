import { regexpValidator, validate } from '../../middleware/validate'

import { Router } from 'express'
import { checkImageAccess } from '../../middleware/authentication'
import error from '../../../utils/error'
import { getImage } from '../../../utils/image'
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
  async ({ params: { id }, query: { width, height, format, raw } }, res) => {
    try {
      const image = imageDb.get(id)
      const dimensions = {
        width: parseInt(width),
        height: parseInt(height),
      }
      const imageBuffer = await getImage({
        image,
        dimensions,
        format,
        raw: !!raw && raw === 'raw',
      }).catch(console.log)

      res
        .status(200)
        .contentType(format || 'image/jpeg')
        .send(imageBuffer)
    } catch (error) {
      routerError(3, res, 'failure getting image')(error)
    }
  },
)

export default images
