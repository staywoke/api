/**
 * @module routes
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

import express from 'express'

import apiUser from './user'
import categories from './categories'
import config from '../../../config'
import profile from './profile'
import settings from './settings'
import tags from './tags'
import token from './token'
import unauthorized from './unauthorized'

const router = express.Router(config.router)
const version = config.get('version')

router.use(`/${version}/`, apiUser)
router.use(`/${version}/`, categories)
router.use(`/${version}/`, profile)
router.use(`/${version}/`, settings)
router.use(`/${version}/`, tags)
router.use(`/${version}/`, token)
router.use(`/${version}/`, unauthorized)

export default router
