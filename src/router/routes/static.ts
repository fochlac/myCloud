import { Router, static as serveStatic } from 'express'

import { join } from 'path'

const staticRouter = Router()

// static content
staticRouter.use('/static', serveStatic(join(global.appRoot, '/static')))

// exception for sw and manifest, needs to be in root
staticRouter.use('/sw.js', serveStatic(join(global.appRoot, 'static/sw.js')))
staticRouter.use('/manifest.json', serveStatic(join(global.appRoot, 'static/manifest.json')))

export default staticRouter
