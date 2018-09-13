import imageDb from 'modules/db/image'
import initDb from 'utils/fileDb'
import urlDb from 'modules/db/url'
import { randomUrl } from 'utils/url'

class GalleryDb {
  db: Core.FileDb
  constructor() {
    initDb('galleries.json').then(db => {
      this.db = db
    })
  }
  async delete(id: Core.Id): Promise<Core.Id> {
    const gallery: Core.BareGallery = this.db.get(id)
    const parent: Core.BareGallery = this.db.get(gallery.parent)

    await Promise.all(gallery.children.map(id => this.delete(id)))
    await Promise.all(gallery.images.map(id => imageDb.delete(id)))

    if (parent) {
      parent.children = parent.children.filter(childId => id !== childId)

      await this.db.set(parent.id, parent)
    }

    return this.db.delete(id)
  }

  get(id: Core.Id): Core.Gallery {
    const gallery: Core.BareGallery = this.db.get(id)

    return gallery && enrichGallery(gallery)
  }

  list(): Core.Gallery[] {
    const galleries: Core.BareGallery[] = this.db.list()
    return galleries.map(enrichGallery)
  }

  async insertImage(id: Core.Id, image: Core.Image): Promise<Core.Gallery> {
    const gallery: Core.BareGallery = this.db.get(id)
    if (!gallery.images.includes(image.id)) {
      gallery.images.push(image.id)
    }
    const newGallery: Core.BareGallery = await this.db.set(id, gallery)
    return enrichGallery(newGallery)
  }

  async deleteImage(id: Core.Id, image: Core.Image): Promise<Core.Gallery> {
    const gallery: Core.BareGallery = this.db.get(id)
    gallery.images = gallery.images.filter(id => id !== image.id)
    const newGallery: Core.BareGallery = await this.db.set(id, gallery)
    return enrichGallery(newGallery)
  }

  async insertAccessUrl(url: Core.AccessUrl): Promise<Core.Gallery> {
    const gallery: Core.BareGallery = this.db.get(url.gallery)
    if (!gallery.urls.includes(url.id)) {
      gallery.urls.push(url.id)
    }
    const newGallery: Core.BareGallery = await this.db.set(gallery.id, gallery)
    return enrichGallery(newGallery)
  }

  async deleteAccessUrl(url: Core.AccessUrl): Promise<Core.Gallery> {
    const gallery: Core.BareGallery = this.db.get(url.gallery)
    gallery.urls = gallery.urls.filter(id => id !== url.id)
    const newGallery: Core.BareGallery = await this.db.set(gallery.id, gallery)
    return enrichGallery(newGallery)
  }

  async update({ name, description, id, parent }) {
    const gallery: Core.BareGallery = this.db.get(id)
    let result
    if (parent !== gallery.parent) {
      const oldParent = this.db.get(gallery.parent)
      const newParent = this.db.get(parent)
      const ancestors = [parent].concat(parent ? newParent.ancestors : [])
      newParent.children.push(id)
      oldParent.children.filter(childId => id !== childId)
      const newGallery = { ...gallery, name, description, parent, ancestors }
      result = await this.db.setMultiple({
        [id]: newGallery,
        [parent]: newParent,
        [gallery.parent]: oldParent,
      })
    } else {
      result = (await this.db.setMultiple({ [id]: { ...gallery, name, description } }))
    }
    return Object.values(result).map((gallery: Core.BareGallery) => enrichGallery(gallery))
  }

  async create({ name, description = '', path, parent }): Promise<Core.Gallery[]> {
    const id = this.db.nextIndex
    const ancestors = []
    const urls = []
    const createObject = {}
    if (parent) {
      const parentGallery: Core.BareGallery = this.db.get(parent)
      parentGallery.children.push(id)
      ancestors.push(parent, ...parentGallery.ancestors)
      createObject[parent] = parentGallery
    } else {
      const initialAccessUrl = await createInitialUrl(id)
      urls.push(initialAccessUrl.id)
    }
    const gallery: Core.BareGallery = {
      name,
      description,
      path,
      parent,
      id,
      images: [],
      urls,
      ancestors,
      children: [],
    }
    createObject[id] = gallery
    const result = await this.db.setMultiple(createObject).catch(err => {
      if (!parent) {
        return urlDb.delete(createObject[id].urls[0].id).then(() => Promise.reject(err))
      }
      return Promise.reject(err)
    })
    return Object.values(result).map(gallery => enrichGallery(gallery))
  }
}

function enrichGallery(gallery: Core.BareGallery): Core.Gallery {
  return {
    ...gallery,
    images: gallery.images.map((id: string): Core.Image => imageDb.get(id)),
    urls: gallery.urls.map(id => urlDb.get(id)),
  } as Core.Gallery
}

function createInitialUrl(id: Core.Id): Promise<Core.AccessUrl> {
  const initialUrl = randomUrl()
  return urlDb.create({
    url: initialUrl,
    gallery: id,
    access: 'write',
    recursive: true,
  })
}

export default new GalleryDb()
