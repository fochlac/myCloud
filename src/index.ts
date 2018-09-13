#!/usr/bin/env node
import './config'

import * as express from 'express'

import { createServer } from 'http'
import router from './router/router'

const app = express()
const server = createServer(app)

server.listen(global.port, global.address, () => {
  console.log(`listening to http://${global.address}:${global.port}/`)
})

app.use(router)
