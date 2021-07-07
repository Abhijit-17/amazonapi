/**
 * 
 * main API testing file
 */

// dependencies
const assert = require('assert')
const request = require('supertest')
const app = require('../app')

describe('API tests', () => {
    it('should ping the api service with response status 200', done => {
        request(app)
            .get('/')
            .end((err, res) => {
                assert(res.statusCode === 200)
                done()
            })
    })
})