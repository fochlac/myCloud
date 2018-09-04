import { Router, static as serveStatic } from 'express'

import apiRouter from './api/index'
import { join } from 'path'
import staticRouter from './static'

const router = Router()

// connect routes
router.use('/api', apiRouter)
router.use(staticRouter)

// catch-all
router.get('*', (req, res) => res.sendFile(join(global.appRoot, 'static/index.html')))
router.all('*', (req, res) => res.status(404).json({ error: 'Unknown Route' }))

export default router
