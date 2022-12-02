const e = require("express")
const _ = require("lodash")

const validateCouponInput = (body) => {
    const { name,
        startDate,
        expDate,
        status,
        reward,
        quantity,
        type } = body

    const errors = {}
    if(!_.isString(name) || !_.isString(startDate) || !_.isString(expDate) || !_.isBoolean(status) || !_.isNumber(reward) || !_.isNumber(quantity) || !_.isString(type)){
        errors.message = 'The input data type is mismatch.'
    } else if (_.isEmpty(name) || _.isEmpty(startDate) || _.isEmpty(expDate) || _.isUndefined(status) || _.isUndefined(reward) || _.isUndefined(quantity) || _.isEmpty(type)) {
        errors.message = 'The input data is not complate.'
    } else if (type !== "1" && type !== "2"){
        errors.message = 'Type is not valid.'
    }

    return errors
}

const checkInputDate = (startDate, expDate) => {
    const errors = {}

    if (_.isNaN(Date.parse(startDate)) || _.isNaN(Date.parse(expDate))) {
        errors.message = 'Not a valid date format.'
    } else {
        startDate = new Date(startDate)
        expDate = new Date(expDate)
        if(expDate.getTime() <= startDate.getTime()) {
            errors.message = 'Start date must must be before end date.'
        }
    }

    return errors
}

const checkCode = (coupon, code) => {
    const errors = {}
    const now = new Date().getTime()
    const startDate = new Date(coupon.startDate).getTime()
    const expDate = new Date(coupon.expDate).getTime()

    if (now >= startDate && now <= expDate) {
        errors.message = 'This code can not use at the moment.'
    } else if(!coupon.status){
        errors.message = 'This code is unavailable.'
    } 

    const index = coupon.codes.findIndex(item => {return item.code === code})
    const remain = coupon.codes[index].remain
    if(remain <= 0){
        errors.message = 'Usage limit has been reached.'
    }

    return errors
}

module.exports = {
    validateCouponInput,
    checkInputDate,
    checkCode
}
