const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')

//setting promise of mogoose with node promise
mongoose.promise = global.promise

// connecting to DB
if(process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost:27017/amazon_reviews')
}

const indexRouter = require('./routes/index')

const app = express()
app.use(helmet())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500).send({'Error': err})
  //res.render('error')
})

module.exports = app
