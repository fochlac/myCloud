import { addToAccessMap, decodeJWT, generateUserAccessMap } from '../../utils/jwt'

import { enrichUser } from '../controller/user'
import galleryDb from '../../modules/db/gallery'
import imageDb from '../../modules/db/image'
import logger from '../../utils/logger'
import urlDb from '../../modules/db/url'
import userDb from '../../modules/db/user'

const log = (level, ...message) => logger(level, '- authentication.ts -', ...message)

function extractTokenFromRequest(request): string | null {
  if (request.headers.jwt) {
    return request.headers.jwt
  }

  if (request.cookies) {
    return request.cookies.jwt || null
  }

  if (request.headers.cookie) {
    let cookie = {}
    request.headers.cookie.split('; ').forEach(str => {
      cookie[str.split('=')[0]] = str.split('=')[1]
    })
    return cookie['gallery-jwt'] || cookie['jwt'] || null
  }

  return null
}

export async function authenticate(req: Express.Request, res, next): Promise<void> {
  const token = extractTokenFromRequest(req)

  if (token) {
    try {
      const parsedToken = await decodeJWT(token!)
      req.token = parsedToken
      req.authenticated = true
      log(7, 'authenticated call ', req.token.user)
      if (req.token.user) {
        req.user = enrichUser(userDb.get(req.token.user))
        req.token.accessMap = generateUserAccessMap(req.user)
      }
    } catch (err) {
      log(4, 'error validating jwt', err)
      req.authenticated = false
    }
    next()
  } else {
    log(7, 'unauthenticated call')
    req.authenticated = false
    next()
  }
}

export function checkGalleryAccessToken(level = ['read', 'write']) {
  return (req: Express.Request, res, next) => {
    const {
      token,
      params: { id },
    } = req

    let gallery = id && galleryDb.get(id)
    if (!gallery) {
      log(4, 'unknown gallery')
      res.status(400).send({
        success: false,
        message: 'Galerie nicht gefunden',
      })
    } else {
      const accessToken = token && getGalleryAccessToken(gallery, token.accessMap)
      if (accessToken && level.includes(accessToken.access)) {
        log(7, `user ${req.user && req.user.id || 'unregistered'} may access gallery ${id} with access level ${level}`)
        req.accessToken = accessToken
        next()
      } else {
        log(4, `user ${req.user && req.user.id || 'unregistered'} tried to access gallery ${id} without access rights`)
        res.status(403).send({
          success: false,
          message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.',
        })
      }
    }
  }
}

export function checkImageAccess(req: Express.Request, res, next) {
  const {
    token,
    params: { id },
  } = req
  const { gallery } = imageDb.get(id)
  const imageGallery = gallery && galleryDb.get(gallery)
  if (!imageGallery) {
    log(4, 'unknown gallery')
    res.status(400).send({
      success: false,
      message: 'Galerie nicht gefunden',
    })
  } else {
    const accessToken = token && getGalleryAccessToken(imageGallery, token.accessMap)
    if (accessToken) {
      log(7, `user ${req.user && req.user.id || 'unregistered'} may access image ${id} with access level ${accessToken.access}`)
      req.accessToken = accessToken
      next()
    } else {
      log(4, `user ${req.user && req.user.id || 'unregistered'} tried to access image ${id} without access rights`)
      res.status(403).send({
        success: false,
        message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.',
      })
    }
  }
}

export function getGalleryAccessToken(
  gallery: Core.Gallery,
  accessMap: Core.AccessMap,
): Core.AccessUrl {
  if (gallery && accessMap) {
    const currentGalleryToken = accessMap[gallery.id] && urlDb.get(accessMap[gallery.id].id)
    const listedAncestorId =
      !currentGalleryToken &&
      gallery.ancestors.find(
        ancestor => !!accessMap[ancestor] && !!urlDb.get(accessMap[ancestor].id),
      )

    log(7, `Gallery ${gallery.id} found in access map`)
    return currentGalleryToken || (listedAncestorId && urlDb.get(accessMap[listedAncestorId].id))
  }
}

export function isAuthenticated(req: Express.Request, res: Express.Response, next) {
  if (req.authenticated) {
    next()
  } else {
    log(4, 'unauthenticated user tried to access restricted route')
    res.status(403).send({
      success: false,
      message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.',
    })
  }
}

export async function checkShortUrl(req, res: Express.Response, next) {
  const accessUrl = urlDb.find('url', req.path)[0]

  if (accessUrl) {
    log(5, `added gallery ${accessUrl.gallery} to access map for user ${req.user && req.user.id || 'unregisterd'}`)
    if (req.user) {
      userDb.addUserUrl(req.user.id, accessUrl)
    }
    const token = await addToAccessMap(req, res, accessUrl)
    req.token = token
    req.startGallery = accessUrl.gallery
  }
  else {
    log(4, `invalid access url ${req.path} was called`)
  }
  next()
}
