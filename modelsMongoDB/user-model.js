const {Schema, model} = require('mongoose')

const User = new Schema({
    id: {type: String, unique: true, required: true},
    id_type: {type: String, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    token: {type: String}
})

module.exports = model('User', User)