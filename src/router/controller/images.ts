import galleryDb from '../../modules/db/gallery'
import imageDb from '../../modules/db/image'
import { deleteFile } from '../../utils/fs'

export default {
  delete: async ({ id, gallery }) => {
    const image = imageDb.get(id)
    if (!image) return
    await deleteFile(image.path)
    await galleryDb.deleteImage(gallery, imageDb.get(id))
    return await imageDb.delete(id)
  },
  create: async ({ gallery, name, description, file }) => {
    const image = await imageDb.create({
      gallery,
      name,
      description,
      path: file.path.split(global.storage)[1],
    })
    await galleryDb.insertImage(gallery, image)
    return image
  },
  update: async ({ id, name, description, gallery }) => {
    const image = await imageDb.update({
      gallery,
      name,
      description,
      id,
    })
    return image
  },
}
