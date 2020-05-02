const { model } = require("mongoose"),
      {request_check} = require('../lib'),
      hospital_schema = require("../model/hospital"),
      hospital = model("hospital");

exports.get_data = async (req, res) => {
    try {
        let data = await hospital.find({})
        const map = {
            "type": "FeatureCollection",
            "features": []
          }

        await data.forEach((obj,index) => {
              let d = {
                "type": "Feature",
                "id": index,
                "properties": {
                  "NAME": obj.hospital,
                  "TEL": obj.contact,
                  "URL": obj.url,
                  "ADDRESS1": obj.location.address,
                  "ADDRES2": null,
                  "CITY": obj.city,
                  "ZIP": obj.location.zip
                },
                "geometry": {
                  "type": "Point",
                  "coordinates": obj.location.coordinates
                }
              }
              map.features.push(d)
          })
        res.json(map)
    } catch (err) {
        console.error(err.toString())
        res.sendStatus(400)
        return
    }
};