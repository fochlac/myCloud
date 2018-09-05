import { decodeJWT, addToAccessMap } from '../../utils/jwt'
import log from '../../utils/logger'
import galleryDb from 'modules/db/gallery'
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

export function checkGalleryAccessToken(req, res, next) {
  const {token: {accessMap}, params: {id}} = req
  if (!id) {
    res.status(400).send({
      success: false,
      message: 'Gallerie nicht gefunden'
    })
  } else if (req.authenticated) {
    let gallery = galleryDb.get(id)
    const ancestor = gallery.ancestors.find((ancestor) => accessMap[ancestor])
    req.accessToken = accessMap[ancestor]
    next()
  } else {
    res
      .status(403)
      .send({
        success: false,
        message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.',
      })
  }
}

export function isAuthenticated(req, res, next) {
  if (req.authenticated) {
    next()
  } else {
    res
      .status(403)
      .send({
        success: false,
        message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.',
      })
  }
}

export function checkShortUrl(req:Core.Request, res:Express.Request, next) {
  const accessUrl = urlDb.find('url', req.path)[0]

  if (accessUrl) {
    addToAccessMap(req, res, accessUrl)
  }
  next()
}
