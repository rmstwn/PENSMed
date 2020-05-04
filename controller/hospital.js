// Import method and module
const {model} = require('mongoose'),
      {
        find_one,
      } = require('../lib'),
       schema = require('../model/hospital'),
       db = model("hospital")

// List all hospital
exports.list_all = (req,res) => {
    db.find({"type": "FeatureCollection"},
        {"features.properties.NAME": 1,
        "features.properties.TEL": 1,
        "features.properties.ADDRESS": 1,
        "features.properties.URL": 1,
        "features.properties.data.staf": 1,
        "features.properties.data.kasur": 1,
        "features.properties.data.pasien": 1,
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
    db.updateOne({type: "FeatureCollection"},{$set: {features: []}} ,(err, respond) => {
        if(err) {
            console.error(err)
            res.sendStatus(500)
            return
        } else if (respond.nModified < 1) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(200)
    })
}

// Remove specified hospital
exports.remove_one = (req,res) => {
    let {name} = req.params

    db.updateOne({type: "FeatureCollection"}, {$pull: {features : {"properties.NAME": name.toUpperCase()}}} ,(err, respond) => {
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
    find_one(db, {"features.properties.NAME": name.toUpperCase()})
        .then(data => res.json(data))
        .catch(err => res.sendStatus(500))
}