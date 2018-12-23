#!/usr/bin/env node

import './config'

import * as express from 'express'

import { createServer } from 'http'
import logger from './utils/logger'
import router from './router/router'

const log = (level, ...message) => logger(level, 'core -', ...message)
const memwatch = require('memwatch-next')

const app = express()
const server = createServer(app)

server.listen(global.port, global.address, () => {
  log(0, `listening to http://${global.address}:${global.port}/`)
})

memwatch.on('leak', (info) => {
  log(1, 'Memory leak detected:\n', info);
});

memwatch.on('stats', function(stats) {
  log(7, 'Garbage Collection ran:\n', stats)
});

app.use(router)
