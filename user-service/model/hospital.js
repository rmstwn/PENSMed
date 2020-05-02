const {Schema, model} = require('mongoose')

const Hospital = new Schema({
    hospital: {
        type: String,
        uppercase: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6
    },
    kode: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    contact : {
        type: String,
        default: '(031)',
        validate: /([0-9()+](\s)?)+/
    },
    url: {
        type: String,
        default: ''
    },
    session: String,
    confirm: String,
    location: {
        address: {
            type: String,
            default: ''
        },
        zip: {
            type: Number,
            default: 0
        },
        coordinates: {
            type: Array,
            default: [0,0]
        }
    },
},{collection: 'hospital'})

module.exports = model("hospital", Hospital)