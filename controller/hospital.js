// Import method and module
const {model} = require('mongoose'),
      {
        find_one,
      } = require('../lib'),
       schema = require('../model/hospital'),
       db = model("hospital")

// List all hospital
exports.list_all = (req,res) => {
    db.find({},
        {email: 0,
        password: 0,
        confirm: 0,
        session: 0,
        "data.apd": 0
        }, (err, data) => {
        if(err) {
            console.error(err)
            res.sendStatus(500)
            return
        }
        res.json(data)
    })
}

// Remove all hospital
exports.remove_all = (req,res) => {
    db.remove({},(err, respond) => {
        if(err) {
            console.error(err)
            res.sendStatus(500)
            return
        } else if (respond.nDeleted < 1) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(200)
    })
}

// Remove specified hospital
exports.remove_one = (req,res) => {
    let {name} = req.params

    db.deleteOne({hospital: name.toUpperCase()},(err, respond) => {
        if(err) {
            console.error(err)
            res.sendStatus(500)
            return
        } else if (respond.nDeleted < 1) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(200)
    })
}

// Find hospital data
exports.hospital_data = (req,res) => {
    let {name} = req.params
    find_one(db, {hospital: name.toUpperCase()})
        .then(data => res.json(data))
        .catch(err => res.sendStatus(500))
}