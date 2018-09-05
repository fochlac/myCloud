import { Router, static as serveStatic } from 'express'

import apiRouter from './api/index'
import { join } from 'path'
import staticRouter from './static'
import { authenticate, checkShortUrl } from 'middleware/authentication';

const router = Router()

// connect routes
router.use(staticRouter)


router.use(authenticate)
router.use('/api', apiRouter)

// check for a shortUrl
router.get('*', checkShortUrl)

// catch-all
router.get('*', (req, res) => res.sendFile(join(global.appRoot, 'static/index.html')))
router.all('*', (req, res) => res.status(404).json({ error: 'Unknown Route' }))

export default router
