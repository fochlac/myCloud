import { mkdir as mkdirRaw, pathExists as pathExistsRaw, remove as removeRaw } from 'fs-extra'

import logger from 'SERVER/utils/logger'

const mkdir = path => mkdirRaw(global.storage + path)
const remove = path => removeRaw(global.storage + path)
const pathExists = path => pathExistsRaw(global.storage + path)

export async function createFolder(name: string, parent: Core.Path): Promise<Core.Path> {
  if (!(await pathExists(parent))) return Promise.reject()
  let path = parent + cleanName(name)
  while (await pathExists(path)) {
    path = parent + cleanName(name)
  }
  await mkdir(path)
  logger(6, 'successfully created folder', path)
  return path + '/'
}

function cleanName(string) {
  return `${string.toLowerCase().replace(/[^a-z0-9_-]+/g, '_')}_${new Buffer(Date.now()).toString('base64')}`
}

export async function deleteFolder(path: string) {
  if (await pathExists(path)) {
    return await remove(path)
  }
}
