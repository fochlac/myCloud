import { Router, static as serveStatic } from 'express'
import { authenticate, checkShortUrl } from 'middleware/authentication'

import apiRouter from './api/index'
import imageRouter from './images'
import { join } from 'path'
import staticRouter from './static'

const router = Router()

// connect routes
router.use(staticRouter)

router.use(authenticate)
router.use('/api', apiRouter)
router.use('/images', imageRouter)

// check for a shortUrl
router.get('*', checkShortUrl)

// catch-all
router.get('*', (req, res) => res.sendFile(join(global.appRoot, 'static/index.html')))
router.all('*', (req, res) => res.status(404).json({ error: 'Unknown Route' }))

export default router
