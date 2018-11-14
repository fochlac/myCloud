import galleryDb from '../../modules/db/gallery'
import urlDb from '../../modules/db/url'
import logger from '../../utils/logger'

const log = (level, ...message) => logger(level, '- controller/urls.ts -', ...message)

export async function Delete(id: Core.Id) {
  log(7, `deleting url ${id}`)
  const url = urlDb.get(id)
  if (!url)  {
    log(4, `url ${id} not found while trying to delete`)
    return Promise.reject('Cannot find url')
  }
  await galleryDb.deleteAccessUrl(url)
  await urlDb.delete(id)
  log(7, `successfully deleted url ${id}`)
  return id
}

export async function Create({ gallery, access, recursive, url }): Promise<Core.AccessUrl> {
  log(7, `adding url for gallery ${gallery} with access level ${access}`)

  const accessUrl = await urlDb.create({
    gallery,
    access,
    recursive,
    url,
  })
  await galleryDb.insertAccessUrl(accessUrl)
  log(7, `successfully added url for gallery ${gallery} with access level ${access}`)
  return accessUrl
}

export async function Update({ id, access, recursive, url }): Promise<Core.AccessUrl> {
  log(7, `updating url ${id} with access level ${access}`)
  const accessUrl = await urlDb.update({ id, access, recursive, url })
  log(7, `successfully updated url ${id} with access level ${access}`)
  return accessUrl
}
