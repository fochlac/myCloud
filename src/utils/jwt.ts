import * as jwt from 'jsonwebtoken'

import log from './logger'

export function createJWT(userObject: Core.user): Promise<string> {
  return new Promise((resolve, reject) => {
    log(6, 'createJWT: Creating JWT for User: ', userObject.name)
    jwt.sign({ id: userObject.id, admin: userObject.admin }, global.secretKey, { issuer: global.address }, (err, token) => {
      if (err) {
        log(5, 'createJWT: Error creating JWT.', err)
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

export function decodeJWT(token: string): Promise<{ id: Core.user['id']; admin: Core.user['admin'] }> {
  return new Promise((resolve, reject) => {
    log(7, 'jwtVerify: decoding JWT-Token')
    jwt.verify(token, global.secretKey, (err, token) => {
      if (err) {
        log(5, 'jwtVerify: No valid Token provided.', err)
        reject(err)
      } else {
        log(7, 'jwtVerify: JWT-Token is valid')
        resolve(token as { id: Core.user['id']; admin: Core.user['admin'] })
      }
    })
  })
}
