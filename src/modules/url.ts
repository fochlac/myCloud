import initDb from 'utils/fileDb'

class UrlDb {
  db: Core.FileDb
  list: () => [Core.AccessUrl]
  get: (id: Core.Id) => Core.AccessUrl
  delete: (id: Core.Id) => Promise<Core.Id>
  constructor() {
    initDb('Urls.json').then(db => {
      this.db = db
      this.list = this.db.list
      this.get = this.db.get
      this.delete = this.db.delete
    })
  }

  async update({ access, recursive, id, url }) {
    const Url = this.get(id)

    const newUrl = await this.db.set(id, { ...Url, access, recursive, url })
    return newUrl as Core.AccessUrl
  }

  async create({ url, access = 'read', recursive, gallery }): Promise<Core.AccessUrl> {
    const id = this.db.nextIndex
    const Url = { url, access, recursive, gallery, id }
    await this.db.set(id, Url)
    return Url as Core.AccessUrl
  }
}

export default new UrlDb()
