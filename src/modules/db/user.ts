import initDb from '../../utils/fileDb'

class UserDb {
  db: Core.FileDb
  list: () => Core.RawUser[]
  find: (key: string, value: any) => Core.RawUser[]
  get: (id: Core.Id) => Core.RawUser
  delete: (id: Core.Id) => Promise<Core.Id>
  constructor() {
    initDb('Users.json').then(db => {
      this.db = db
      this.list = this.db.list.bind(this.db)
      this.get = this.db.get.bind(this.db)
      this.find = this.db.find.bind(this.db)
      this.delete = this.db.delete.bind(this.db)
    })
  }

  async update({ urls, name, id }) {
    const user = this.get(id)

    const newUser = await this.db.set(id, { ...user, urls, name, id })
    return newUser as Core.RawUser
  }

  async create({ urls, name, hash, salt }): Promise<Core.RawUser> {
    const id = this.db.nextIndex
    const User = await this.db.set(id, { urls, name, hash, id, salt })
    return User as Core.RawUser
  }
}

export default new UserDb()
