const {Schema, model} = require('mongoose')

const Donor = new Schema({
    name: {
        type: String,
        minlength: 2,
        validate: /^([A-Za-z]+[.]?\s?)+$/
    },
    email: {
        type: String,
        unique: true,
        validate: /^[a-zA-Z]\w+@[a-zA-Z]+(\.[a-zA-Z]+)?(\.[a-z]{2,3}){1,2}$/
    },
    password: {
        type: String,
        minlength: 6
    },
    session: String,
    confirm: String,
    perusahaan: {
        type: String
    }
},{collection: 'donor'})

module.exports = model("donor", Donor)