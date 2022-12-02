const express = require('express')
const router = express.Router()

const couponController = require('../controllers/coupon')

router.route('/')
    .get(couponController.getAllCoupon)
    .post(couponController.generateCoupon)

router.route('/status')
    .put(couponController.triggerStatusCoupon)

router.route('/use')
    .post(couponController.useCoupon)

module.exports = router
