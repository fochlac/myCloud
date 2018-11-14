import { createUserHash, verifyUser } from '../../modules/password'

import urlDb from '../../modules/db/url'
import userDb from '../../modules/db/user'
import logger from '../../utils/logger'

const log = (level, ...message) => logger(level, '- controller/user.ts -', ...message)

export async function Create({ name, password, token }: loginData): Promise<Core.User> {
  log(6, `creating user ${name}`)
  const users = userDb.find('name', name)
  if (users.length) return Promise.reject('double user name')

  const { salt, hash } = await createUserHash(password)
  const urls = token ? Object.values(token.accessMap).map(url => url.id) : []
  const user = await userDb.create({ name, salt, hash, urls })
  log(6, `successfully created user ${name}, ${user.id}`)
  return enrichUser(user)
}

interface loginData {
  token: Core.WebToken
  password: string
  name: string
}

export async function login({ name, token, password }: loginData): Promise<Core.User> {
  log(7, `user ${name} trying to log in`)
  let user = await verifyUser({ name, password })
  if (token) {
    log(7, `updating access map of user ${name} while logging in`)
    const newTokens = Object.values(token.accessMap)
    .map(url => url.id)
    .filter(id => !user.urls.includes(id))
    user.urls = user.urls.concat(newTokens)
    user = await userDb.update(user)
  }

  log(6, `user ${name} successfully logged in`)
  return enrichUser(user)
}

export function enrichUser(user: Core.RawUser): Core.User {
  return {
    id: user.id,
    name: user.name,
    urls: user.urls.map(id => urlDb.get(id)),
  } as Core.User
}
