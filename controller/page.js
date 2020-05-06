const {hashing} = require('../lib'),
   {model} = require('mongoose'),
   path = require('path'),
   hospital_schema = require('../model/hospital'),
   donor_schema = require('../model/donor'),
   hospital = model("hospital"),
   donor = model("donor")

// Send register.html
exports.register_page = (req,res) => {
    res.sendFile(path.resolve(__dirname, '../public/views/register.html'))
}

// Send login.html
exports.login_page = async (req,res) => {
    let {logged_in} = req.cookies,
        {session} = req.signedCookies

    if (logged_in == undefined || logged_in != 'yes' || session == undefined || !session)
        res.cookie('logged_in','no',{maxAge:360000})
    else if (session != undefined || session) {
        try {
            let hash = hashing(session,10),
                data = await donor.findOne({session: hash})
                if(data == null)
                    data = await hospital.findOne({session: hash})

            if(data != null) {
                res.redirect('/')
                return
            }
        } catch(err){
            console.error(err.toString())
            res.sendStatus(500)
            return
        }
    }
    res.sendFile(path.resolve(__dirname, '../public/views/login.html'))
}

// Send index.html
exports.index_page = async (req,res) => {
    let {logged_in} = req.cookies,
        {session} = req.signedCookies
            
    if (logged_in == undefined || logged_in != 'yes' || session == undefined || !session)
        res.cookie('logged_in','no',{maxAge:360000})
    else if (session != undefined || session) {
        try {
            let hash = hashing(session,10),
                data = await donor.findOne({session: hash})
                if (data != null) {
                    res.redirect('/donor')
                    return
                } else if(data == null) {
                    data = await hospital.findOne({session: hash})
                    if (data != null) {
                        res.redirect('/hospital')
                        return
                    }
                }

            if(data == null) {
                res.clearCookie('session')
            }
        } catch(err){
            console.error(err.toString())
            res.sendStatus(500)
            return
        }
    }
    res.sendFile(path.resolve(__dirname, '../public/views/index.html'))
}

// Send edit.html
exports.edit_page = async (req,res) => {
    let {logged_in} = req.cookies,
        {session} = req.signedCookies
            
    if (logged_in == undefined || logged_in != 'yes' || session == undefined || !session) {
        res.redirect('/')
        return
    }
    else if (session != undefined || session) {
        try {
            let hash = hashing(session,10),
                data = await hospital.findOne({session: hash})

            if(data == null) {
                res.redirect('/')
                return
            }
        } catch(err){
            console.error(err.toString())
            res.sendStatus(500)
            return
        }
    }    
    res.sendFile(path.resolve(__dirname, '../public/views/hospital.html'))
}

exports.donor_page = async (req,res) => {
    let {logged_in} = req.cookies,
        {session} = req.signedCookies
            
    if (logged_in == undefined || logged_in != 'yes' || session == undefined || !session) {
        res.redirect('/')
        return
    }
    else if (session != undefined || session) {
        try {
            let hash = hashing(session,10),
                data = await donor.findOne({session: hash})

            if(data == null) {
                res.redirect('/')
                return
            }
        } catch(err){
            console.error(err.toString())
            res.sendStatus(500)
            return
        }
    }    
    res.sendFile(path.resolve(__dirname, '../public/views/donor.html'))
}
