import galleryDb from 'modules/db/gallery'
import urlDb from 'modules/db/url'

export async function Delete(id: Core.Id) {
  const url = urlDb.get(id)
  if (!url) return Promise.reject('Cannot find url')
  await galleryDb.deleteAccessUrl(url)
  return urlDb.delete(id)
}

export async function Create({ gallery, access, recursive, url }): Promise<Core.AccessUrl> {
  const accessUrl = await urlDb.create({
    gallery,
    access,
    recursive,
    url,
  })
  await galleryDb.insertAccessUrl(accessUrl)
  return accessUrl
}

export async function Update({ id, access, recursive, url }): Promise<Core.AccessUrl> {
  const accessUrl = await urlDb.update({ id, access, recursive, url })
  return accessUrl
}
