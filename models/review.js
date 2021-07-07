/***
 * defining schema for reviews
 */

// dependencies
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Review Schema
// author is not mandatory
// title is not mandatory
// rating should be a number between 1 and 5 (including 1 and 5)

//create the Schema
const reviewSchema = new Schema({
    review: {
        type: String,
        required: [true, 'Review is required']
    },
    author: String,
    review_source: {
        type: String,
        required: [true, 'Review Source is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        validate: {
            validator: (rating) => rating >= 1 && rating <= 5,
            message: 'Rating should be a number a number between 1 and 5'
        }
    },
    title: String,
    product_name: {
        type: String,
        required: [true, 'Product name is required']
    },
    reviewed_date: {
        type: Date,
        required: [true, 'Reviewed date is required']
    }
})

// create the model
const Review = mongoose.model('review', reviewSchema)

// export the model
module.exports = Review