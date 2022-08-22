const express = require('express')
const router = express.Router()

const { home } = require('../controller/UserRouteController')

router
    .route('/')
    .get(home)
module.exports = router