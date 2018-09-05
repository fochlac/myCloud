import { mkdir as mkdirRaw, pathExists as pathExistsRaw, remove as removeRaw } from 'fs-extra'

import logger from 'utils/logger'

const mkdir = path => mkdirRaw(global.storage + path)
const remove = path => removeRaw(global.storage + path)
const pathExists = path => pathExistsRaw(global.storage + path)

export async function createFolder(name: string, parent: Core.Path): Promise<Core.Path> {
  if (!(await pathExists(parent)))
    return Promise.reject('parent folder does not exist: ' + global.storage + parent)
  let path = parent + cleanName(name)
  while (await pathExists(path)) {
    path = parent + cleanName(name)
  }
  await mkdir(path)
  logger(6, 'successfully created folder', path)
  return path + '/'
}

function cleanName(string) {
  const regex = /[^a-z0-9_-]+/g
  const uuid = new Buffer('' + Date.now()).toString('base64').replace(regex, '')
  return `${string.toLowerCase().replace(regex, '_')}_${uuid}`
}

export async function deleteFolder(path: string) {
  if (await pathExists(path)) {
    return await remove(path)
  }
}
