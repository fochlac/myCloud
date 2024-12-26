import initDb from '../../utils/fileDb'

class TextNodeDb {
  db: Core.FileDb
  list: () => Core.TextNode[]
  get: (id: Core.Id) => Core.TextNode
  delete: (id: Core.Id) => Promise<Core.Id>

  constructor() {
    initDb('textNodes.json').then(db => {
      this.db = db
      this.list = this.db.list.bind(this.db)
      this.get = this.db.get.bind(this.db)
      this.delete = this.db.delete.bind(this.db)
    })
  }

  async update({ id, text, type, dateTime }): Promise<Core.TextNode> {
    const textNode = this.get(id)
    const newTextNode = await this.db.set(id, {
      ...textNode,
      text,
      type,
      dateTime,
      lastModified: Date.now()
    })
    return newTextNode as Core.TextNode
  }

  async create({ text, type, galleryId, dateTime }): Promise<Core.TextNode> {
    const id = this.db.nextIndex
    const now = Date.now()
    const textNode = {
      id,
      text,
      type,
      galleryId,
      dateTime,
      created: now,
      lastModified: now
    }
    await this.db.set(id, textNode)
    return textNode as Core.TextNode
  }
}

export default new TextNodeDb()
