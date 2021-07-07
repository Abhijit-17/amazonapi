/**
 * star file for setting up db for testing
 * 
 */

// dependencies
const mongoose = require('mongoose')

//making sure that the mongoose connection is established before any test is performed
before(done => {
    // connect to DB
    mongoose.connect('mongodb://localhost:27017/amazon_reviews_test')
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.log('Error', err)
        })
})

//before each test drop the test data base
beforeEach(done => {
    const { reviews } = mongoose.connection.collections
    if (reviews) {
        reviews.drop()
            .then(() => done())
            .catch(() => done())
    } else {
        done()
    }
})