import { createUserHash, verifyUser } from '../../modules/password'

import urlDb from '../../modules/db/url'
import userDb from '../../modules/db/user'

export async function Create({ name, password, token }: loginData): Promise<Core.User> {
  const users = userDb.find('name', name)
  if (users.length) return Promise.reject('double user name')

  const { salt, hash } = await createUserHash(password)
  const urls = token ? Object.values(token.accessMap).map(url => url.id) : []
  const user = await userDb.create({ name, salt, hash, urls })
  return enrichUser(user)
}

interface loginData {
  token: Core.WebToken
  password: string
  name: string
}

export async function login({ name, token, password }: loginData): Promise<Core.User> {
  let user = await verifyUser({ name, password })
  if (token) {
    const newTokens = Object.values(token.accessMap)
      .map(url => url.id)
      .filter(id => !user.urls.includes(id))
    user.urls = user.urls.concat(newTokens)
    user = await userDb.update(user)
  }

  return enrichUser(user)
}

export function enrichUser(user: Core.RawUser): Core.User {
  return {
    id: user.id,
    name: user.name,
    urls: user.urls.map(id => urlDb.get(id)),
  } as Core.User
}
