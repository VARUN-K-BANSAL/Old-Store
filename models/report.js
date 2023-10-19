const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
    complainer: {
        type: String,
        required: true
    },
    suspect: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    isResolved: {
        type: Boolean,
        required: true
    }
},
{
    timestamps: true
})

module.exports = new mongoose.model('Report', reportSchema)