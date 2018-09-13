import { Router } from 'express'
import galleries from './galleries/index'
import imageRouter from './images'

const api = Router()

api.use('/galleries', galleries)
api.use('/images', imageRouter)

api.all('*', (req, res) => {
  res.status(404).send({ success: false, reason: 'unknown_route' })
})

export default api
