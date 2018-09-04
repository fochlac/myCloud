import * as bodyparser from 'body-parser'
import * as compression from 'compression'
import * as xssFilter from 'x-xss-protection'

import { Router } from 'express'
import routes from './routes/routes'

const router = Router()

// apply generic middleware
router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))
router.use(compression())
router.use(xssFilter())

router.use((req, res, next) => {
  console.log(req.originalUrl)

  next()
})

// connect routes
router.use(routes)

export default router
