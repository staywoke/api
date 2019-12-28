/**
 * @module routes
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

const express = require('express')

const apiUser = require('./user')
const categories = require('./categories')
const config = require('../../../config')
const profile = require('./profile')
const settings = require('./settings')
const tags = require('./tags')
const token = require('./token')
const unauthorized = require('./unauthorized')

const router = express.Router(config.router)
const version = config.get('version')

router.use(`/${version}/`, apiUser)
router.use(`/${version}/`, categories)
router.use(`/${version}/`, profile)
router.use(`/${version}/`, settings)
router.use(`/${version}/`, tags)
router.use(`/${version}/`, token)
router.use(`/${version}/`, unauthorized)

module.exports = router
