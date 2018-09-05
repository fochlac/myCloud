import galleryDb from 'modules/db/gallery'
import urlDb from 'modules/db/url'

export default {
  delete: id => galleryDb.delete(id),
  create: async ({ gallery, access, recursive, url }) => {
    const accessUrl = await urlDb.create({
      gallery,
      access,
      recursive,
      url,
    })
    await galleryDb.insertAccessUrl(gallery, accessUrl)
    return accessUrl
  },
  update: async ({ id, access, recursive, url }) => {
    const accessUrl = await urlDb.update({ id, access, recursive, url })
    return accessUrl
  },
}
