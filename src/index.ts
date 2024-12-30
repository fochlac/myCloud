#!/usr/bin/env node

import './config'

import * as express from 'express'

import { ensureDir } from 'fs-extra'
import { createServer } from 'http'
import logger from './utils/logger'
import router from './router/router'

const log = (level, ...message) => logger(level, 'core -', ...message)

async function init() {
  const app = express()
  const server = createServer(app)

  server.listen(global.port, global.address, () => {
    log(0, `listening to http://${global.address}:${global.port}/`)
  })

  await ensureDir(global.storage)

  app.use(router)
}

init()
