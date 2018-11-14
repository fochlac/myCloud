import { createFolder, deleteFolder } from '../../utils/fs'

import error from '../../utils/error'
import galleryDb from '../../modules/db/gallery'
import { getGalleryAccessToken } from '../middleware/authentication'
import logger from '../../utils/logger'

const log = (level, ...message) => logger(level, 'controller/gallery.ts -', ...message)

const location = 'controller/gallery.ts'
const { internalError } = error(location)

export async function Create({
  name,
  parent,
  description,
}: Core.RawGallery): Promise<Core.Gallery[]> {
  const { path = '' } = galleryDb.get(parent) || {}

  log(7, `creating new gallery ${name} as child of ${parent}`)

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

  log(7, `successfully created new gallery ${name} as child of ${parent}`)
  return gallery
}

export async function Update({
  name,
  id,
  description,
  parent,
}: Core.RawGallery): Promise<Core.Gallery[]> {
  log(7, `updating gallery ${id}`)

  const newGallery = await galleryDb.update({ name, id, description, parent })

  log(7, `successfully updated gallery ${id}`)

  return newGallery
}

export async function Delete(id: Core.Id): Promise<Core.Id> {
  const { path } = galleryDb.get(id)

  log(7, `deleting gallery ${id}`)

  await deleteFolder(path)
  await galleryDb.delete(id)

  log(7, `successfully deleted gallery ${id}`)
  return id
}

export function ReadAll(accessMap: Core.AccessMap) {
  const galleries = galleryDb.list()

  log(7, `getting galleries`)

  const filteredGalleries = galleries
    .map(gallery => {
      const accessToken = getGalleryAccessToken(gallery, accessMap)
      if (accessToken && accessToken.access === 'read') {
        gallery.urls = []
      }
      return { ...gallery, accessToken }
    })
    .filter(gallery => !!gallery.accessToken)

  log(7, `got ${filteredGalleries.length} galleries`)

  return filteredGalleries
}

export function Read(id: Core.Id) {
  log(7, `getting gallery ${id}`)

  return galleryDb.get(id)
}

export default {
  Create,
  Update,
  Delete,
  ReadAll,
  Read,
}
