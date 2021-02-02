const mongoose = require('./connection');
const config = require('../../config');

const UserModel = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 6,
        required: true
    },
    created_at: {
		type: Date,
        required: true,
        default: Date.now()
    },
    tokens: {
		token: {
			type: String,
		}
    },
    reset_token: {
        token: {
            type: String
        },
        expired_at: {
            type: String
        }
    }
});

const User = mongoose.model('user', UserModel);

module.exports = User
