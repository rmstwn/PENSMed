// Import method and module
const {model} = require('mongoose'),
      {
        request_check,
        insert_data,
        find_one,
        localTime
      } = require('../lib'),
       schema = require('../model/model'),
       db = model("hospital_data")

// List all hospital
exports.list_all = (req,res) => {
    db.find({},
        {rumah_sakit: 1,
        "data.staf": 1,
        "data.kasur": 1,
        "data.pasien": 1,
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
    db.remove({}, (err, respond) => {
        if(err) {
            console.error(err)
            res.sendStatus(500)
            return
        } else if (respond.nRemoved < 1) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(200)
    })
}

// Remove specified hospital
exports.remove_one = (req,res) => {
    let {name} = req.params

    db.deleteOne({rumah_sakit: name.toUpperCase()}, (err, respond) => {
        if(err) {
            console.error(err)
            res.sendStatus(500)
            return
        } else if (respond.deletedCount < 1) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(200)
    })
}

// Find hospital data
exports.hospital_data = (req,res) => {
    let {name} = req.params
    find_one(db, {rumah_sakit: name.toUpperCase()})
        .then(data => res.json(data))
        .catch(err => res.sendStatus(500))
}

// Create hospital
exports.create_data = async (req,res) => {
    // Get body request
    let {
        rumah_sakit,
        rawat_inap,
        perawat,
        dokter,
        icu
    } = req.body

    try {
        // Check if request is undefined
        await request_check(rumah_sakit, 'rumah_sakit')
        await request_check(rawat_inap, 'rawat_inap')
        await request_check(icu, 'icu')
        await request_check(perawat, 'perawat')
        await request_check(dokter, 'dokter')

        if (Object.keys(req.body).length != 5) {
            res.sendStatus(400)
            return
        }// If request is number
        else if (!isNaN(rumah_sakit)) {
            res.sendStatus(400)
            return
        }

    } catch(err) {
        res.status(400).send(err.toString())
        return
    }
    // Data model
    let model = {
        rumah_sakit: rumah_sakit.toUpperCase(),
        data: [{
            update_time: localTime(),
            kasur: {
                rawat_inap: {tersedia: rawat_inap},
                icu: {tersedia: icu}
            },
            staf: {
                dokter: {ada: dokter},
                perawat: {ada: perawat}
            },
        }]
    }
    
    // Insert to DB
    try {
        await db.create(model)
    } catch(err) {
        console.error(err.toString())
        res.sendStatus(500)
        return
    }

    res.sendStatus(200)
}