import imageDb from 'modules/image'
import initDb from 'utils/fileDb'
import urlDb from 'modules/url'

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

  list(): [Core.Gallery] {
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
    gallery.image = gallery.images.filter(id => id == !image.id)
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
    gallery.urls = gallery.urls.filter(id => id == !url.id)
    const newGallery = await this.db.set(id, gallery)
    return enrichGallery(newGallery)
  }

  async update({ name, description, id, parent }) {
    const gallery = this.db.get(id)

    const newGallery = await this.db.set(id, { ...gallery, name, description, parent })
    return enrichGallery(newGallery)
  }

  async create({ name, description = '', path, parent }): Promise<Core.Gallery> {
    const id = this.db.nextIndex
    const images = []
    const urls = []
    const gallery = { name, description, path, parent, id, images, urls }
    await this.db.set(id, gallery)
    return enrichGallery(gallery)
  }
}

function enrichGallery(gallery): Core.Gallery {
  gallery.images = gallery.images.map(id => imageDb.get(id))
  gallery.urls = gallery.urls.map(id => urlDb.get(id))
  return gallery as Core.Gallery
}

export default new GalleryDb()
