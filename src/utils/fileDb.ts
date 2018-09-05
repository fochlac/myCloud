import * as clone from 'clone'

import {
  moveSync as moveSyncRaw,
  outputFile as outputFileRaw,
  pathExists as pathExistsRaw,
  readJSON as readJSONRaw,
} from 'fs-extra'

import error from 'utils/error'

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
    this.highestIndex = Object.keys(initialState).length
      ? Math.max(...Object.keys(initialState).map(key => +key))
      : 0
  }

  list() {
    return clone(Object.values(this.content)) as [any]
  }

  get(id: Core.Id) {
    return clone(this.content[id])
  }

  find(key: string, value: string) {
    return clone(Object.values(this.content).filter(elem => elem[key] === value)) as [any]
  }

  async set(id, value) {
    this.content[id] = clone(value)
    await write(this.content, this.path)
    return clone(value)
  }

  get nextIndex(): Core.Id {
    this.highestIndex++
    return this.highestIndex.toString()
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
      initialState = await readJSON(path, 'utf8')
    } catch (error) {
      internalError(1, 'error opening the stored db')(error)
      moveSync(path, path.split('.')[0] + '_backup_' + Date.now() + '.json')
    }
  }
  return new FileDb(path, initialState)
}
