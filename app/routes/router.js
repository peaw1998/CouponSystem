const express = require('express')
const router = express.Router()

const couponRoutes = require('../services/coupons/routes/router')

router.use('/coupon', couponRoutes)

module.exports = router
