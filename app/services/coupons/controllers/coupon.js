const HTTPStatus = require('http-status')
const _ = require('lodash')

const service = require('../libs/validate')
const code = require('../libs/code')
const manage = require('../libs/manage')

const couponModel = require('../model/coupon')

async function generateCoupon (req, res, next) {
  try {
    const errorsInput = await service.validateCouponInput(req.body)
    if (!_.isEmpty(errorsInput)) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: errorsInput.message })
    }

    const { startDate, expDate, type, quantity } = req.body
    const errorsDate = await service.checkInputDate(startDate, expDate)
    if (!_.isEmpty(errorsDate)) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: errorsDate.message })
    }

    const codeData = code.generateCode(type, quantity)
    const result = manage.insertCoupon(req.body, codeData)

    if (_.isEmpty(result)) {
      return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: "Generate code is fail." })
    } else {
      return res.status(HTTPStatus.OK).json({ success: true, result: result })
    }
  } catch (err) {
    return next(err)
  }
}

async function useCoupon (req, res, next) {
    try {
        const { code } = req.body 
        if (_.isEmpty(code)) {
            return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: "Input data is not complete." })
        }

        let codeIndex
        const index =  _.findIndex(couponModel.Coupons, function(o) { 
                codeIndex = o.codes.findIndex(item => { 
                return item.code === code})
            return codeIndex >= 0 }
        )

        if (index < 0) {
            return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: "Code is unavailable." })
        }

        const errors = service.checkCode(couponModel.Coupons[index], code)
        if (!_.isEmpty(errors)) {
            return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: errors.message })
        }

        couponModel.Coupons[index].codes[codeIndex].remain -= 1
        return res.status(HTTPStatus.BAD_REQUEST).json({ success: true, result: { message: "Can use this code." , reward: couponModel.Coupons[index].reward } })
    } catch (err) {
      return next(err)
    }
}

async function triggerStatusCoupon (req, res, next) {
    try {
        const { id } = req.body
        if (_.isEmpty(id)) {
            return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: "Input data is not complete." })
        }
    
        const index =  _.findIndex(couponModel.Coupons, function(o) { return o.id == id })
        if(index < 0){
            return res.status(HTTPStatus.BAD_REQUEST).json({ success: false, message: "Coupon id is not exist." })
        }

        couponModel.Coupons[index].status = !couponModel.Coupons[index].status
        return res.status(HTTPStatus.OK).json({ success: true, result: couponModel.Coupons[index]})
    } catch (err) {
      return next(err)
    }
}

async function getAllCoupon (req, res, next) {
    try {
        return res.status(HTTPStatus.OK).json({ success: true, result: couponModel.Coupons})           
    } catch (err) {
      return next(err)
    }
}

module.exports = {
  generateCoupon,
  triggerStatusCoupon,
  useCoupon,
  getAllCoupon
}
