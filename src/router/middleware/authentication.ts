import { decodeJWT } from '../../utils/jwt'
import log from '../../utils/logger'

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
      // TODO: get user from db
      req.admin = parsedToken.admin
      req.user = parsedToken
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

export function isAdmin(req, res, next) {
  if (req.authenticated && req.admin) {
    next()
  } else {
    res.status(403).send({ success: false, message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.' })
  }
}

export function isAuthenticated(req, res, next) {
  if (req.authenticated) {
    next()
  } else {
    res.status(403).send({ success: false, message: 'Sie haben unzureichende Rechte um diese Aktion auszuführen.' })
  }
}
