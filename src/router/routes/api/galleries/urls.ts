import { Router } from 'express'
import url from 'CONTROLLER/urls'

const urls = Router()

urls.get(url.read)
urls.post(url.create)
urls.delete(url.delete)

export default urls
