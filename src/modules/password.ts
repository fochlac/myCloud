import * as crypto from 'crypto'

import log from '../utils/logger'
import userDb from './db/user'

const conf = {
  iterations: 20000,
  hashBytes: 32,
  digest: 'sha512',
}

function generateSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, salt) => {
      if (err) {
        log(2, 'error creating salt', err)
        return reject(err)
      }
      resolve(salt.toString('base64'))
    })
  })
}

function generateHash(value: string, salt: string): Promise<{ salt: string; hash: string }> {
  if (!value || !value.length) {
    log(4, 'error, no pass provided', value)
    return Promise.reject({ status: 400, message: 'Kein Passwort' })
  }
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(value, salt, conf.iterations, conf.hashBytes, conf.digest, (err, hash) => {
      if (err) {
        log(2, 'error creating hash', err)
        return reject(err)
      }

      resolve({
        hash: hash.toString('base64'),
        salt,
      })
    })
  })
}

export async function createUserHash(password: string): Promise<{ salt: string; hash: string }> {
  const salt = await generateSalt()
  return generateHash(password, salt)
}

export async function verifyUser({ password, name }) {
  const user = userDb.find('name', name)[0]
  if (!user) {
    log(4, `unable to find user ${name}`)
    return Promise.reject({ status: 400, type: 'BAD_USER' })
  }
  return generateHash(password, user.salt).then(
    newHash => {
      if (user.hash === newHash.hash) {
        log(6, `user ${name} successfully logged in`)
        return Promise.resolve(user)
      } else {
        log(4, `user ${name} failed to log in due to an invalid password`)
        return Promise.reject({ status: 403, type: 'BAD_PASSWORD' })
      }
    }
  )
}
