const {model} = require('mongoose'),
	  {request_check, hashing} = require('../lib'),
	  path = require('path'),
      hospital_schema = require('../model/hospital'),
      donor_schema = require('../model/donor'),
      hospital = model("hospital"),
      donor = model("donor")
      
exports.list = async (req,res) => {
	const {list} = req.query

	try {
		await request_check(list, 'list')
		if (list == 'donor')
			donor.find({})
				.then(data => res.json(data))
				.catch(err => res.sendStatus(500))
		else if (list == 'hospital')
			hospital.find({})
				.then(data => res.json(data))
				.catch(err => res.sendStatus(500))
		else if (list == 'all') {
			let arr = []
			let data = await donor.find({})
			arr.push(data)
			data = await hospital.find({})
			arr.push(data)
			res.json(arr)
		}
	} catch(err) {
		console.error(err)
		res.send(err.toString())
		return
	}
}

exports.update_data = async(req,res) => {
	let {logged_in} = req.cookies,
		{session} = req.signedCookies,
		{category} = req.query

	if (logged_in != 'yes' || logged_in == undefined || session == undefined || !session) {
		res.sendStatus(401)
		return
	}

	try {
		await request_check(category, 'category')
		
		session = hashing(session,10)

		if (category != 'donor' && category != 'hospital') {
			res.sendStatus(400)
			return
		} else if (category == 'donor') {
			const {name,perusahaan} = req.body

			await request_check(name, 'name')
			await request_check(perusahaan, 'perusahaan')
			let status = await donor.updateOne({session: session},
				{$set: {name: name, perusahaan: perusahaan}},{upsert: true})
			if(status.nModified < 1) {
				res.sendStatus(400)
				return
			}
		} else if (category == 'hospital') {
			const {
					hospital_name,
					contact,
					address,
					coord1,
					coord2,
					city,
					kode,
					url,
					zip
				} = req.body

			await request_check(hospital_name, 'hospital_name')
			await request_check(contact, 'contact')
			await request_check(address, 'address')
			await request_check(coord1, 'coord1')
			await request_check(coord2, 'coord2')
			await request_check(city, 'city')
			await request_check(kode, 'kode')
			await request_check(url, 'url')
			await request_check(zip, 'zip')

			let status = await hospital.updateOne({session: session},{
					$set: {
						hospital: hospital_name,
						contact: contact,
						city: city,
						kode: kode,
						url: url,
						location: {
							address1: address,
							zip: zip,
							coordinates: [coord1, coord2]
						}
					}
				})
			
			if (status.nModified < 1) {
				res.sendStatus(400)
				return
			}
		}
	} catch(err) {
		res.status(400).send(err.toString())
		return
	}
	res.sendStatus(200)
}
