import { addToAccessMap, decodeJWT, generateUserAccessMap } from '../../utils/jwt'

import { enrichUser } from '../controller/user'
import galleryDb from '../../modules/db/gallery'
import imageDb from '../../modules/db/image'
import log from '../../utils/logger'
import urlDb from '../../modules/db/url'
import userDb from '../../modules/db/user'

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
      if (req.token.user) {
        req.user = enrichUser(userDb.get(req.token.user))
        req.token.accessMap = generateUserAccessMap(req.user)
      }
    } catch (err) {
      log(2, 'error validating jwt', err)
      req.authenticated = false
    }
    next()
  } else {
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
      res.status(400).send({
        success: false,
        message: 'Galerie nicht gefunden',
      })
    } else {
      const accessToken = token && getGalleryAccessToken(gallery, token.accessMap)
      if (accessToken && level.includes(accessToken.access)) {
        req.accessToken = accessToken
        next()
      } else {
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
    res.status(400).send({
      success: false,
      message: 'Galerie nicht gefunden',
    })
  } else {
    const accessToken = token && getGalleryAccessToken(imageGallery, token.accessMap)
    if (accessToken) {
      req.accessToken = accessToken
      next()
    } else {
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

    return currentGalleryToken || (listedAncestorId && urlDb.get(accessMap[listedAncestorId].id))
  }
}

export function isAuthenticated(req: Express.Request, res: Express.Response, next) {
  if (req.authenticated) {
    next()
  } else {
    res.status(403).send({
      success: false,
      message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.',
    })
  }
}

export async function checkShortUrl(req, res: Express.Response, next) {
  const accessUrl = urlDb.find('url', req.path)[0]

  if (accessUrl) {
    if (req.user) {
      userDb.addUserUrl(req.user.id, accessUrl)
    }
    const token = await addToAccessMap(req, res, accessUrl)
    req.token = token
    req.startGallery = accessUrl.gallery
  }
  next()
}
