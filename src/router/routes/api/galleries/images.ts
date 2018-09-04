import { Router } from 'express'
import image from 'CONTROLLER/images'

const images = Router()

images.get(image.read)
images.put(image.update)
images.post(image.create)
images.delete(image.delete)

export default images
