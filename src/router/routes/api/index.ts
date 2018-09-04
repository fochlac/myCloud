import { Router } from 'express'
import galleries from './galleries/index'

const api = Router()

api.use('/galleries', galleries)

export default api
