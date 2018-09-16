import * as jwt from 'jsonwebtoken'

import log from './logger'

export function createJWT(token: Core.WebToken): Promise<string> {
  return new Promise((resolve, reject) => {
    log(6, 'createJWT: Creating JWT', token)
    jwt.sign(token, global.secretKey, { issuer: global.address }, (err, token) => {
      if (err) {
        log(5, 'createJWT: Error creating JWT.', err)
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

export function decodeJWT(token: string): Promise<Core.WebToken> {
  return new Promise((resolve, reject) => {
    log(7, 'jwtVerify: decoding JWT-Token')
    jwt.verify(token, global.secretKey, (err, decodedToken) => {
      if (err) {
        log(5, 'jwtVerify: No valid Token provided.', err)
        reject(err)
      } else {
        log(7, 'jwtVerify: JWT-Token is valid')
        resolve(decodedToken as Core.WebToken)
      }
    })
  })
}

const newToken: Core.WebToken = {
  accessMap: {},
}

export async function addToAccessMap(
  req: Express.Request,
  res: Express.Response,
  accessUrl: Core.AccessUrl,
) {
  let baseToken = req.token || newToken
  delete baseToken.iss
  delete baseToken.iat

  const token = await createJWT({
    ...baseToken,
    accessMap: {
      ...baseToken.accessMap,
      [accessUrl.gallery]: accessUrl,
    },
  })
  res.cookie('jwt', token, jwtCookieOptions)
}

export async function createUserToken(
  req: Express.Request,
  res: Express.Response,
  user: Core.User,
) {
  const token = await createJWT({
    user: user.id,
    accessMap: user.urls.reduce((accessMap, url) => {
      accessMap[url.gallery] = url
      return accessMap
    }, {}),
  })

  res.cookie('jwt', token, jwtCookieOptions)
}

const jwtCookieOptions = {
  secure: false,
  httpOnly: true,
  expires: new Date(Date.now() + 1000 * 3600 * 24 * 31),
}
