// 'use strict'

const express = require('express')
const HTTPStatus = require('http-status')
const bodyParser = require('body-parser')

const routes = require('./app/routes/router')

const app = express()
app.use(bodyParser.json({ limit: '15mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/health', (req, res, next) => res.status(HTTPStatus.OK).json({ ok: true }))

app.use('/api', routes)

const port = 9000
app.listen(port, () => {
    console.log(`SERVER IS RUNNING AT PORT ${port}.`)
})



module.exports = app
