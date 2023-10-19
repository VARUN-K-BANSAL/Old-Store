const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: String,
            required: true
        }
    }],
    amount: {
        type: Number,
        require: true
    }
},
{
    timestamps: true
})

module.exports = new mongoose.model('Cart', cartSchema)