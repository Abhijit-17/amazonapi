/**
 * 
 * All tests for review controllers
 * 
 */

// dependencies
const assert = require('assert')
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const Review = require('../../models/review')

// describe
describe('Review controllers test', () => {

    // need to create some records before each of these test are run , 
    //specialy if we have to read records we need to make sure that there is data to read
    let review1, review2, review3
    beforeEach(done => {
        review1 = new Review({
            review: 'Slow and laggy.  This app will make you think you didn\'t accurately touch some button, then you\'ll touch it again and it will buffer that and then send you somewhere else beyond that you may have wanted.\n\nAnother shortcoming is that the alarm in which Amazon setup alexa to not be able to play music (Amazon\'s, Pandora, Spotify).  This \'smart\' internet attached thing can\'t match the capability of a basic alarm clock which can play  music (via local airwave broadcast). Ponder that.',
            author: 'Screbob',
            review_source: 'iTunes',
            rating: 1,
            title: 'Slow, laggy, feature limited.',
            product_name: 'Amazon Alexa',
            reviewed_date: new Date('2017-12-08T20:44:55.000Z')
        })

        review2 = new Review({
            review: 'Screen freezes when asking for permissions',
            author: 'Qugeqbfetddhy',
            review_source: 'GooglePlayStore',
            rating: 2,
            title: 'Does not work on iPhone X',
            product_name: 'Amazon Alexa',
            reviewed_date: new Date('2017-12-08T21:18:21.000Z')
        })

        review3 = new Review({
            review: 'Pretty cool app and gives you more detail than Google app',
            author: 'Joti Shepherd',
            review_source: 'GooglePlayStore',
            rating: 5,
            title: 'Better than google app',
            product_name: 'Amazon Alexa',
            reviewed_date: new Date('2018-01-24T00:00:00.000Z')
        })

        Promise.all([review1.save(), review2.save(), review3.save()])
            .then(() => done())
            .catch(err => done(err))
    })

    it('should post a request to /review and create a review', done => {
        // if the Review is created then the count of the reviews will increase by 1
        Review.count()
            .then(count => {
                request(app)
                    .post('/review')
                    .send({
                        review: 'Pero deberia de poder cambiarle el idioma a alexa',
                        author: 'WarcryxD',
                        review_source: 'iTunes',
                        rating: 4,
                        title: 'Excelente',
                        product_name: 'Amazon Alexa',
                        reviewed_date: new Date('2018-01-12T02:27:03.000Z')
                    })
                    .end((err, res) => {
                        Review.count()
                            .then(newCount => {
                                assert(count + 1 === newCount)
                                done()
                            })
                            .catch(err => {
                                console.log('error', err.message)
                                done(err)
                            })
                    })
            })
            .catch(err => {
                console.log('error', err.message)
                done()
            })
    })

    // read tests
    it('should /get reviews (all)', done => {
        request(app)
            .get('/review')
            .end((err, res) => {
                assert(res.body.length > 0)
                done()
            })
    })

    it('should /get reviews (date)', done => {
        request(app)
            .get('/review?date=2017-12-08T21:18:21.000Z')
            .end((err, res) => {
                // check if every record has the same date we passed in the query
                const validResults = res.body.every(record => new Date(record.reviewed_date).toISOString() === '2017-12-08T21:18:21.000Z')
                assert(validResults === true)
                done()
            })
    })

    it('should /get reviews (rating)', done => {
        request(app)
            .get('/review?rating=1')
            .end((err, res) => {
                // check if every record has the same date we passed in the query
                const validResults = res.body.every(record => record.rating === 1)
                assert(validResults === true)
                done()
            })
    })

    it('should /get reviews (store)', done => {
        request(app)
            .get('/review?store=iTunes')
            .end((err, res) => {
                // check if every record has the same date we passed in the query
                const validResults = res.body.every(record => record.review_source === 'iTunes')
                assert(validResults === true)
                done()
            })
    })

    it('should /get count of rating by category', done => {
        request(app)
            .get('/ratingcount')
            .end((err, res) => {
                const validResults = res.body.every(record => {
                    const _id = typeof record._id === 'number' && record._id >= 1 && record._id <= 5 ? record._id : false
                    const count = typeof record.count === 'number' ? record.count : false
                    return _id && count
                })
                assert(validResults === true)
                done()
            })
    })

    it('should /get the average monthly rating per store (review source)', done => {
        request(app)
            .get('/avgrating')
            .end((err, res) => {
                const validResults = res.body.every(record => {
                    const _id = typeof record._id === 'object'
                        && typeof record._id.month === 'number'
                        && typeof record._id.year === 'number' ? record._id : false
                    const averageRating = typeof record.averageRating === 'number' ? record.averageRating : false
                    return _id && averageRating
                })
                assert(validResults === true)
                done()
            })
    })
})