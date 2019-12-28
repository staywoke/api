/**
 * @module router
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const express = require('express')

const config = require('./config')
const routerApiV1 = require('./api/v1/routes/index')

var router = express.Router(config.get('router'))

router.use('/', routerApiV1)

module.exports = router
