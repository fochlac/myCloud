import initDb from 'SERVER/utils/fileDb'

class GalleryDb {
  db: Core.FileDb
  get: (id: Core.Id) => Core.Gallery
  list: () => [Core.Gallery]
  delete: (id: Core.Id) => Promise<Core.Id>
  constructor() {
    initDb('galleries.json').then(db => {
      this.db = db
      this.get = this.db.get
      this.list = this.db.list
      this.delete = this.db.delete
    })
  }

  async update({ name, description, id }) {
    const gallery = this.get(id)

    const newGallery = await this.db.set(id, { ...gallery, name, description })
    return newGallery as Core.Gallery
  }

  async create({ name, description = '', path, parent }): Promise<Core.Gallery> {
    const id = this.db.nextIndex
    const images = []
    const gallery = { name, description, path, parent, id, images }
    await this.db.set(id, gallery)
    return gallery as Core.Gallery
  }
}

export default new GalleryDb()
