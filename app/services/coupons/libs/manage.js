const _ = require("lodash")
const couponModel = require('../model/coupon')

const insertCoupon = (body,code) => {
    let data

    if(body.type === "1") {
        code = code.map((item) => {
            return { code: item, remain: body.quantity }
        })
        data = {
            ...body,
            codes: code
        }
    } else if(body.type === "2") {
        code = code.map((item) => {
            return { code: item, remain: 1 }
        })
        data = {
            ...body,
            codes: code
        }
    }

    couponModel.Coupons.push({ id: couponModel.Coupons.length , ...data })

    return data
}

module.exports = {
    insertCoupon
}
