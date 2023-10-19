const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    batch: {
        type: Number,
        require: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    otp: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    chats: [{
        userId: {
            type: String,
            required: true
        },
        messages: [{
            message: {
                type: String,
                required: true
            },
            isSent: {
                type: Boolean,
                required: true
            }
        }]
    }],
    isAdmin: {
        type: Boolean,
        required: true
    }
},
{
    timestamps: true
})

userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({_id: this._id}, SECRET_KEY)
        this.tokens = this.tokens.concat({token: token})
        await this.save()
        return token
    } catch (error) {
        console.log(error);
    }
}

const User = new mongoose.model('User', userSchema)

module.exports = User