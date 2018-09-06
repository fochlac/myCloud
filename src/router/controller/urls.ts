import galleryDb from 'modules/db/gallery'
import urlDb from 'modules/db/url'

export function Delete(id: Core.Id) {
  return galleryDb.delete(id)
}

export async function Create({ gallery, access, recursive, url }): Promise<Core.AccessUrl> {
  const accessUrl = await urlDb.create({
    gallery,
    access,
    recursive,
    url,
  })
  await galleryDb.insertAccessUrl(gallery, accessUrl)
  return accessUrl
}

export async function Update({ id, access, recursive, url }): Promise<Core.AccessUrl> {
  const accessUrl = await urlDb.update({ id, access, recursive, url })
  return accessUrl
}
