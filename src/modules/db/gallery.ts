import imageDb from 'modules/db/image'
import initDb from 'utils/fileDb'
import urlDb from 'modules/db/url'

class GalleryDb {
  db: Core.FileDb
  delete: (id: Core.Id) => Promise<Core.Id>
  constructor() {
    initDb('galleries.json').then(db => {
      this.db = db
      this.delete = this.db.delete
    })
  }

  get(id: Core.Id): Core.Gallery {
    const gallery = this.db.get(id)

    return gallery && enrichGallery(gallery)
  }

  list(): Core.Gallery[] {
    const galleries = this.db.list()
    galleries.map(enrichGallery)
    return galleries
  }

  async insertImage(id: Core.Id, image: Core.Image): Promise<Core.Gallery> {
    const gallery = this.db.get(id)
    if (!gallery.images.includes(image.id)) {
      gallery.images.push(image.id)
    }
    const newGallery = await this.db.set(id, gallery)
    return enrichGallery(newGallery)
  }

  async deleteImage(id: Core.Id, image: Core.Image): Promise<Core.Gallery> {
    const gallery = this.db.get(id)
    gallery.images = gallery.images.filter(id => id !== image.id)
    const newGallery = await this.db.set(id, gallery)
    return enrichGallery(newGallery)
  }

  async insertAccessUrl(id: Core.Id, url: Core.AccessUrl): Promise<Core.Gallery> {
    const gallery = this.db.get(id)
    if (!gallery.urls.includes(url.id)) {
      gallery.urls.push(url.id)
    }
    const newGallery = await this.db.set(id, gallery)
    return enrichGallery(newGallery)
  }

  async deleteAccessUrl(id: Core.Id, url: Core.AccessUrl): Promise<Core.Gallery> {
    const gallery = this.db.get(id)
    gallery.urls = gallery.urls.filter(id => id !== url.id)
    const newGallery = await this.db.set(id, gallery)
    return enrichGallery(newGallery)
  }

  async update({ name, description, id, parent }) {
    const gallery = this.db.get(id)
    let result
    if (parent !== gallery.parent) {
      const oldParent = this.db.get(gallery.parent)
      const newParent = this.db.get(parent)
      const ancestors = [parent].concat(parent ? newParent.ancestors : [])
      newParent.children.push(id)
      oldParent.children.filter(childId => id !== childId)
      const newGallery = {...gallery, name, description, parent, ancestors}
      result = await this.db.setMultiple({
        [id]: newGallery,
        [parent]: newParent,
        [gallery.parent]: oldParent
      })
    } else {
      result = await this.db.setMultiple({id: { ...gallery, name, description }})
    }
    return Object.values(result).map(gallery => enrichGallery(gallery))
  }

  async create({ name, description = '', path, parent }): Promise<Core.Gallery[]> {
    const id = this.db.nextIndex
    const initialAccessUrl = await createInitialUrl(id)
    const ancestors = []
    const createObject = {}
    if (parent) {
      const parentGallery = this.db.get(parent)
      parentGallery.children.push(id)
      ancestors.push(parent, ...parentGallery.ancestors)
      createObject[parent] = parentGallery
    }
    const gallery = { name, description, path, parent, id, images: [], urls: [initialAccessUrl.id], ancestors, children: [] }
    createObject[id] = gallery
    const result = await this.db.setMultiple(createObject).catch(err => {
      return urlDb.delete(initialAccessUrl.id).then(() => Promise.reject(err))
    })
    return Object.values(result).map(gallery => enrichGallery(gallery))
  }
}

function enrichGallery(gallery): Core.Gallery {
  gallery.images = gallery.images.map(id => imageDb.get(id))
  gallery.urls = gallery.urls.map(id => urlDb.get(id))
  return gallery as Core.Gallery
}

function createInitialUrl(id: Core.Id): Promise<Core.AccessUrl> {
  const initialUrl = '/' + new Buffer('url_' + Date.now()).toString('base64')
  return urlDb.create({
    url: initialUrl,
    gallery: id,
    access: 'write',
    recursive: true,
  })
}

export default new GalleryDb()
