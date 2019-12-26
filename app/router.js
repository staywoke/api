/**
 * @module router
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import express from 'express'

import config from './config'
import routerApiV1 from './api/v1/routes/index'

var router = express.Router(config.get('router'))

router.use('/', routerApiV1)

export default router
