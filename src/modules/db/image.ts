import initDb from '../../utils/fileDb'

class ImageDb {
  db: Core.FileDb
  list: () => Core.Image[]
  get: (id: Core.Id) => Core.Image
  delete: (id: Core.Id) => Promise<Core.Id>
  constructor() {
    initDb('Images.json').then(db => {
      this.db = db
      this.list = this.db.list.bind(this.db)
      this.get = this.db.get.bind(this.db)
      this.delete = this.db.delete.bind(this.db)
    })
  }

  async update({ name, description, id }) {
    const Image = this.get(id)

    const newImage = await this.db.set(id, { ...Image, name, description })
    return newImage as Core.Image
  }

  async modify({ id }) {
    const Image = this.get(id)

    const newImage = await this.db.set(id, { ...Image, lastModified: Date.now() })
    return newImage as Core.Image
  }

  async create({ name, description = '', path, gallery, created, imageTaken }): Promise<Core.Image> {
    const id = this.db.nextIndex
    const Image = { name, description, path, gallery, id, created, imageTaken, lastModified: Date.now() }
    await this.db.set(id, Image)
    return Image as Core.Image
  }
}

export default new ImageDb()
