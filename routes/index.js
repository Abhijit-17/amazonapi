const express = require('express')
const router = express.Router()
const apiControllers = require('../controllers/controllers')

/* GET home page. */
router.get('/', apiControllers.render)

// ping service
router.get('/ping', apiControllers.ping)

// create review
router.post('/review', apiControllers.create)

// read review for date, rating and store (review_source)
router.get('/review', apiControllers.read)

// get average rating, by store (in our DB I am taking review_source as store)
router.get('/avgrating', apiControllers.averageRatingBySource)

// get the total number of rating by category
router.get('/ratingcount', apiControllers.countRatingByCategory)

module.exports = router
