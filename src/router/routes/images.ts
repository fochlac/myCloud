import { Router } from 'express'
import { checkImageAccess } from 'middleware/authentication'
import error from 'utils/error'
import getImage from 'utils/image'
import imageDb from 'modules/db/image'

const { routerError } = error('image-router')

const images = Router()

images.get(
  '/:id',
  checkImageAccess,
  async ({ params: { id }, query: { width, height, format } }, res) => {
    try {
      const image = imageDb.get(id)
      const dimensions = {
        width: parseInt(width),
        height: parseInt(height),
      }
      const imageBuffer = await getImage(image, dimensions, format)
      console.log('called')

      res.contentType(format || 'jpeg').send(imageBuffer)
    } catch (error) {
      routerError(3, res, 'failure getting image')
    }
  },
)

export default images
