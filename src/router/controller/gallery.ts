import { createFolder, deleteFolder } from 'utils/fs'

import error from 'utils/error'
import galleryDb from 'modules/db/gallery'
import { hasGalleryAccessToken } from 'middleware/authentication'

const location = 'controller/gallery.ts'
const { internalError } = error(location)

export default {
  create: async ({ name, parent, description }: Core.RawGallery): Promise<Core.Gallery[]> => {
    const { path = '' } = galleryDb.get(parent) || {}

    const newPath = await createFolder(name, path).catch(
      internalError(3, 'unable to create directory', name, path),
    )

    if (!newPath) return Promise.reject('')

    const gallery = await galleryDb
      .create({ name, parent, description, path: newPath })
      .catch(
        internalError(3, 'unable to create gallery', { name, parent, description, path: newPath }),
      )

    if (!gallery) {
      deleteFolder(newPath).catch(internalError(5, 'unable to remove created directory', newPath))
      return Promise.reject('')
    }

    return gallery
  },

  update: async ({ name, id, description, parent }: Core.RawGallery): Promise<Core.Gallery[]> => {
    const newGallery = await galleryDb.update({ name, id, description, parent })
    return newGallery
  },

  delete: async (id: Core.Id): Promise<Core.Id> => {
    const { path } = galleryDb.get(id)
    await deleteFolder(path)
    await galleryDb.delete(id)
    return id
  },

  readAll: (accessMap: Core.AccessMap) => {
    const galleries = galleryDb.list()
    return galleries
      .map(gallery => ({ ...gallery, accessToken: hasGalleryAccessToken(gallery, accessMap) }))
      .filter(gallery => !!gallery.accessToken)
  },

  read: (id: Core.Id) => galleryDb.get(id),
}
