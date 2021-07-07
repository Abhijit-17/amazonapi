/**
 * 
 * main controllers files
 */

// dependencies
const Review = require("../models/review")

// export all controllers
module.exports = {
    // home page renderer
    render(req, res, next) {
        res.render('index', { title: 'Amazon API for Signify' })
    },

    //ping handler
    ping(req, res, next) {
        res.status(200).send({ 'message': 'Amazon API is up and running' })
    },

    // create review
    create(req, res, next) {
        const reviewOptions = req.body
        Review.create(reviewOptions)
            .then(review => res.send(review))
            .catch(next)
    },

    // read reviews
    read(req, res, next) {
        const { date, rating, store } = req.query
        const searchQuery = {}
        if (date) searchQuery.reviewed_date = new Date(date)
        if (rating) searchQuery.rating = rating
        if (store) searchQuery.review_source = store
        Review.find(searchQuery)
            .then(results => {
                if (results.length > 0) {
                    res.send(results)
                } else {
                    res.status(404).send({ 'message': 'no records found' })
                }
            })
            .catch(next)
    },

    // get average monthly rating per store
    averageRatingBySource(req, res, next) {
        Review.aggregate([
            {
                $group:
                {
                    _id: { month: { $month: '$reviewed_date' }, year: { $year: '$reviewed_date' } },
                    averageRating: { $avg: '$rating' }
                }
            }
        ])
            .then(results => res.send(results))
            .catch(next)
    },

    // total rating for each category, i.e. how many 5 star, 4 star and so on ....
    countRatingByCategory(req, res, next) {
        Review.aggregate([
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            }
        ])
            .then(results => res.send(results))
            .catch(next)
    }
}