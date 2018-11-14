import { deleteFile } from '../../utils/fs'
import galleryDb from '../../modules/db/gallery'
import imageDb from '../../modules/db/image'
import { rotateImage } from '../../utils/image'
import logger from '../../utils/logger'

const log = (level, ...message) => logger(level, '- controller/images.ts -', ...message)

export default {
  delete: async ({ id, gallery }) => {
    log(7, `deleting image ${id} from gallery ${gallery}`)
    const image = imageDb.get(id)

    if (!image) {
      log(4, `image ${id} not found in gallery ${gallery} while trying to delete`)
      return
    }
    await deleteFile(image.path)
    await galleryDb.deleteImage(gallery, imageDb.get(id))

    log(7, `successfully deleted image ${id} from gallery ${gallery}`)
    return await imageDb.delete(id)
  },

  create: async ({ gallery, name, description, file, created }) => {
    log(7, `adding image ${name} to gallery ${gallery}`)
    const image = await imageDb.create({
      gallery,
      name,
      description,
      created,
      path: file.path.split(global.storage)[1],
    })
    await galleryDb.insertImage(gallery, image)
    log(7, `successfully added image ${image.id} to gallery ${gallery}`)
    return image
  },

  update: async ({ id, name, description, gallery }) => {
    log(7, `updating image ${id} in gallery ${gallery}`)
    const image = await imageDb.update({
      name,
      description,
      id,
    })
    log(7, `successfully updated image ${id} in gallery ${gallery}`)
    return image
  },

  rotate: async ({ id, direction }) => {
    log(7, `rotating image ${id}`)
    let image = imageDb.get(id)
    if (!image) {
      log(4, `image ${id} not found`)
      return
    }
    image = await rotateImage(image, direction === 'right')

    log(7, `successfully rotated image ${id} to ${direction}`)
    return imageDb.modify({ id })
  },
}
