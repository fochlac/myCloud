import * as cookieParser from 'cookie-parser'
import * as bodyparser from 'body-parser'
import * as compression from 'compression'
import * as xssFilter from 'x-xss-protection'

import { Router } from 'express'
import routes from './routes/routes'
import logger from '../utils/logger'

const router = Router()

// apply generic middleware
router.use(cookieParser())
router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))
router.use(compression())
router.use(xssFilter())

router.use((req, res, next) => {
  logger(7, `${req.method} call to ${req.originalUrl}`)

  next()
})

// connect routes
router.use(routes)

export default router
