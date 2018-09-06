import { Router } from 'express'
import galleries from './galleries/index'
import imageRouter from './images'

const api = Router()

api.use('/galleries', galleries)
api.use('/images', imageRouter)

export default api
