import log from '../utils/logger'
import userDb from './db/user'
import crypto from 'crypto'

const conf = {
  iterations: 20000,
  hashBytes: 32,
  digest: 'sha512',
}

function generateSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, salt) => {
      if (err) {
        log(3, 'error creating salt', err)
        return reject(err)
      }
      resolve(salt.toString('base64'))
    })
  })
}

function generateHash(value: string, salt: string): Promise<{ salt: string; hash: string }> {
  if (!value || !value.length) {
    log(5, 'error, no pass provided', value)
    return Promise.reject({ status: 400, message: 'Kein Passwort' })
  }
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(value, salt, conf.iterations, conf.hashBytes, conf.digest, (err, hash) => {
      if (err) {
        log(5, 'error creating hash', err)
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
    return Promise.reject({ status: 400, type: 'BAD_USER' })
  }
  return generateHash(password, user.salt).then(
    newHash =>
      user.hash === newHash.hash
        ? Promise.resolve(user)
        : Promise.reject({ status: 403, type: 'BAD_PASSWORD' }),
  )
}
