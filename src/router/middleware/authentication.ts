import { addToAccessMap, decodeJWT } from '../../utils/jwt'

import galleryDb from 'modules/db/gallery'
import imageDb from 'modules/db/image'
import log from '../../utils/logger'
import urlDb from 'modules/db/url'

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
    return cookie['jwt'] || null
  }

  return null
}

export async function authenticate(req, res, next): Promise<void> {
  const token = extractTokenFromRequest(req)

  if (token) {
    try {
      const parsedToken = await decodeJWT(token!)
      req.token = parsedToken
      req.authenticated = true
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
  return (req, res, next) => {
    const {
      token,
      params: { id },
    } = req

    let gallery = id && galleryDb.get(id)
    if (!gallery) {
      res.status(400).send({
        success: false,
        message: 'Gallerie nicht gefunden',
      })
    } else {
      const accessToken = token && hasGalleryAccessToken(gallery, token.accessMap)
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

export function checkImageAccess(req, res, next) {
  const {
    token,
    params: { id },
  } = req
  const { gallery } = imageDb.get(id)
  const imageGallery = gallery && galleryDb.get(gallery)
  if (!imageGallery) {
    res.status(400).send({
      success: false,
      message: 'Gallerie nicht gefunden',
    })
  } else {
    const accessToken = token && hasGalleryAccessToken(imageGallery, token.accessMap)
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

export function hasGalleryAccessToken(
  gallery: Core.Gallery,
  accessMap: Core.AccessMap,
): Core.AccessUrl {
  if (gallery) {
    const accessToken =
      (accessMap && accessMap[gallery.id]) ||
      accessMap[gallery.ancestors.find(ancestor => !!accessMap[ancestor])]
    return accessToken
  }
}

export function isAuthenticated(req, res, next) {
  if (req.authenticated) {
    next()
  } else {
    res.status(403).send({
      success: false,
      message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.',
    })
  }
}

export async function checkShortUrl(req: Express.Request, res: Express.Response, next) {
  const accessUrl = urlDb.find('url', req.path)[0]

  if (accessUrl) {
    await addToAccessMap(req, res, accessUrl)
  }
  next()
}
