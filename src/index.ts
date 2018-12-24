#!/usr/bin/env node

import './config'

import * as express from 'express'

import { createServer } from 'http'
import logger from './utils/logger'
import router from './router/router'

const log = (level, ...message) => logger(level, 'core -', ...message)

const app = express()
const server = createServer(app)

server.listen(global.port, global.address, () => {
  log(0, `listening to http://${global.address}:${global.port}/`)
})

app.use(router)
