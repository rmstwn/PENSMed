const {request_check,
       random_bytes,
       hashing
      } = require('../lib'),
      {model} = require('mongoose'),
      hospital_schema = require('../model/hospital'),
      donor_schema = require('../model/donor'),
      hospital = model("hospital"),
      donor = model("donor"),
      bcrypt = require('bcrypt')

exports.authentication = async (req,res) => {
    const {email, password} = req.body
    let hospital_account, donor_account, account_password

    try {
        await request_check(email,'email')
        await request_check(password,'password')
    } catch(err) {
        res.status(400).send(err)
        return
    }

    try {
        donor_account = await donor.findOne({email: email}, {password: 1})
        if (donor_account != null)
            account_password = donor_account.password
        else {
            hospital_account = await hospital.findOne({email: email},{password: 1})
            account_password = hospital_account.password
        }

        if (hospital_account == null && donor_account == null) {
            res.sendStatus(400)
            return
        } else if (!bcrypt.compareSync(password, account_password)) {
            res.status(401).send('Email or password is wrong')
            return
        }

        let token = random_bytes(20),
            hash = hashing(token,10)
        
        if (hospital_account != null) {
            await hospital.updateOne({email: email},{$set: {session: hash}})
        } else {
            await donor.updateOne({email: email},{$set: {session: hash}})
        }

        res.cookie('session',token,{maxAge:360000,signed:true,secure:true})
        
    } catch(err) {
        console.error(err)
        if (err instanceof TypeError) {
            res.sendStatus(400)
            return
        }
        res.sendStatus(500)
        return
    }

    res.cookie('logged_in','yes',{maxAge:360000})
    res.redirect('/')
}
