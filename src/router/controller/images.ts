import galleryDb from 'modules/db/gallery'
import imageDb from 'modules/db/image'

export default {
  delete: id => imageDb.delete(id),
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
