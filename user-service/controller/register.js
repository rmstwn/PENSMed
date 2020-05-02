// Import function and module
const {
    send_mail,
    request_check,
    check_pattern,
    random_bytes,
    hashing
    } = require('../lib'),
      {model} = require('mongoose'),
      donor_schema = require('../model/donor'),
      hospital_schema = require('../model/hospital'),
      donor = model("donor"),
      hospital = model("hospital"),
      path = require('path'),
      bcrypt = require('bcrypt')

// Send register.html
exports.register_page = (req,res) => {
    res.sendFile(path.resolve(__dirname, '../public/views/register.html'))
}

// Send confirmation link via email
exports.email_confirm = async (req,res) => {
    let {token} = req.params,
        {category} = req.query

    try {
        // Check if token is defined
        await request_check(token,'token')
        
        if (token.length < 100) {
            res.redirect('/')
            return
        }
        // Check if category is defined
        await request_check(category,'category')
        
        if (category !== "hospital" && category !== "donor") {
            res.sendStatus(400)
            return
        }

    } catch(err) {
        res.sendStatus(404)
        return
    }

    try {
        // Hash token
        let hash = hashing(token, 10)
        let data

        if(category == 'donor')
            data = await donor.updateOne({confirm: hash}, {$unset: {confirm: ''}})
        else if (category == 'hospital')
            data = await hospital.updateOne({confirm: hash}, {$unset: {confirm: ''}})

        // If there is no change
        if(data.modifiedCount < 1) {
            res.sendStatus(400)
            return
        }
    } catch(err) {
        console.error(err)
        res.sendStatus(500)
        return
    }
    // Redirect to homepage
    res.redirect('/')
}

// Register user
exports.register_data = async (req,res) => {
    // Get specified request
    const {category} = req.query
    let {
            password,
            confirm_password,
            name,
            email,
            perusahaan,
            kode
        } = req.body
    
    let query,model,
        randombyte = random_bytes(100),
        hash = hashing(randombyte,10)

    try {
        // Check if request is not undefined
        await request_check(category, 'category')
        await request_check(email, 'email')
        await request_check(password, 'password')
        await request_check(confirm_password, 'confirm_password')
        await request_check(name, 'name')

        let data = await donor.find({email: email})
        if (data == null)
            data = await hospital.find({email: email})

        // Check request pattern with RegEx
        if(!check_pattern(email, 'email')) {
            res.status(400).send('Wrong email format')
            return
        } else if (data.length > 0) {
            // Prevent duplicate email
            res.status(401).send('Email already registered')
            return
        } else if (!check_pattern(password,'password')) {
            res.status(400).send('Password requires at least 1 uppercase, 1 lowercase, 1 number,\
and minimum 6 characters')
            return
        } else if(password !== confirm_password) {
            res.status(400).send('Password does not match')
            return
        }

        // Encrypt password
        password = bcrypt.hashSync(password, 12)
        
        if (category == 'donor') {
            if (perusahaan == undefined)
                perusahaan = ''

            if(!check_pattern(name,'name')) {
                res.status(400).send('Name can only contains uppercase/lowercase letter and . (dot)')
                return
            }
            model = {
                email: email,
                password: password,
                name: name,
                perusahaan: perusahaan,
                confirm: hash
            }
            await donor_schema.create(model)
        } else if (category == 'hospital') {
            if (kode == undefined)
                kode = ''
            model = {
                email: email,
                password: password,
                name: name,
                kode: kode
            }
            await hospital_schema.create(model)
        }
    } catch(err) {
        // If error occurs
        res.status(400).send(err.toString())
        return
    }

    try {
        let mail = {
            subject: 'PENSMed Email Confirmation',
            content: `Terima kasih telah mendaftar di PENSMed, silahkan lakukan konfirmasi email dengan
mengklik link berikut: <br/>
<a href="${process.env.HOST_URL + '/confirm/' + randombyte + '?category=' + category}">
${process.env.HOST_URL + '/confirm/' + randombyte + '?category=' + category}</a>
<br/><br/> Admin PENSMed`
        }
        await send_mail(email,mail)
    } catch(err) {
        res.sendStatus(500)
        console.error(err)
        return
    }

    res.sendStatus(200)
}