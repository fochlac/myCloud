import { moveSync as moveSyncRaw, outputFile as outputFileRaw, pathExists as pathExistsRaw, readJSON as readJSONRaw } from 'fs-extra'

import clone from 'clone-deep'
import error from 'SERVER/utils/error'

const { internalError } = error('fileDb')
const outputFile = (path, data, options) => outputFileRaw(global.storage + path, data, options)
const pathExists = path => pathExistsRaw(global.storage + path)
const readJSON = (path, options) => readJSONRaw(global.storage + path, options)
const moveSync = (path, path2) => moveSyncRaw(global.storage + path, global.storage + path2)

class FileDb {
  content: object
  path: string
  highestIndex: number
  constructor(path, initialState) {
    this.content = initialState
    this.path = path
    this.highestIndex = Math.max(...Object.keys(initialState).map(key => +key))
  }

  list() {
    return clone(this.content)
  }

  get(id: Core.Id) {
    return clone(this.content[id])
  }

  find(key: string, value: string) {
    return clone(Object.values(this.content).filter(elem => elem[key] === value))
  }

  async set(id, value) {
    await write(this.content, this.path)
    this.content[id] = clone(value)
    return clone(value)
  }

  get nextIndex(): Core.Id {
    return this.highestIndex++
  }

  async delete(id: Core.Id) {
    await write(this.content, this.path)
    delete this.content[id]
    return id
  }
}

function write(content: object, path: Core.Path): void {
  const data = JSON.stringify(content, null, 2)
  outputFile(path, data, 'utf8')
}

export default async function initDb(path: Core.Path, initialState: object = {}): Promise<FileDb> {
  if (await pathExists(path)) {
    try {
      initialState = readJSON(path, 'utf8')
    } catch (error) {
      internalError(1, 'error opening the stored db')(error)
      moveSync(path, path.split('.')[0] + '_backup_' + Date.now() + '.json')
    }
  }
  return new FileDb(path, initialState)
}
