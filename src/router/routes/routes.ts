import { authenticate, checkShortUrl } from '../middleware/authentication'

import { Router } from 'express'
import apiRouter from './api/index'
import { serveIndex } from '../controller/index'
import staticRouter from './static'

const router = Router()

// connect routes
router.use(staticRouter)

router.use(authenticate)
router.use('/api', apiRouter)

// check for a shortUrl
router.get(/^\/t\/[0-9a-zA-z_+]{7,14}$/, checkShortUrl)
router.get(/^\/[0-9a-zA-z_+]{7,14}$/, checkShortUrl)

// catch-all
router.get('*', serveIndex)
router.all('*', (req, res) => res.status(404).json({ error: 'Unknown Route' }))

export default router
