// Check if environment variable is defined
exports.env_check = (env, name) => {
    if (env == undefined) {
        console.error(`Please define ${name}`)
        return
    }
}

// Get server start time
exports.localTime = () => {
    let day, month, time

    switch (new Date().getDay()) {
        case 0:
          day = "Minggu";
          break;
        case 1:
          day = "Senin";
          break;
        case 2:
           day = "Selasa";
          break;
        case 3:
          day = "Rabu";
          break;
        case 4:
          day = "Kamis";
          break;
        case 5:
          day = "Jum'at";
          break;
        case 6:
          day = "Sabtu";
      }

    switch (new Date().getMonth()) {
        case 0:
          month = "Januari";
          break;
        case 1:
          month = "Februari";
          break;
        case 2:
          month = "Maret";
          break;
        case 3:
          month = "April";
          break;
        case 4:
          month = "Mei";
          break;
        case 5:
          month = "Juni";
          break;
        case 6:
          month = "Juli";
        case 7:
          month = "Agustus";
        case 8:
          month = "September";
        case 9:
          month = "Oktober";
        case 10:
          month = "November";
        case 11:
          month = "Desember";
    }

    time = `${day}, ${new Date().getDate()} ${month} ${new Date().getFullYear()} pukul ${new Date().toLocaleString().slice(10)}`

    return time
};

// Check if request if defined
exports.request_check = (request,name,type) => {
    if (request == undefined || request == '')
        return Promise.reject(`Please define ${name}`)
    
    return Promise.resolve('ok')
}

// RegEx pattern check
exports.check_pattern = (str, type) => {
    let pattern
    if (type == 'password')
        pattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}/
    else if (type == 'email')
        pattern = /^[a-zA-Z]\w+@[a-zA-Z]+(\.[a-zA-Z]+)?(\.[a-z]{2,3}){1,2}$/
    else if (type == 'name')
        pattern = /^([A-Za-z]+[.]?\s?)+$/
    else {
        console.error('pattern has not configured')
        return false
    }

    return pattern.test(str)
}

// Generate random bytes
exports.random_bytes = (length) => {
    // Import crypto module
    const crypto = require('crypto'),
          bytes = crypto.randomBytes(length)

    // If length is not number
    if(isNaN(length))
        return

    // Return random bytes
    return bytes.toString('hex')
}

// Hashing data
exports.hashing = (text, counter) => {
    // Import crypto module
    const crypto = require('crypto'),
          hash = crypto.createHash('sha256')

    if (counter < 1)
        return

    // Loop hashing
    for(let i = 0; i < counter; i++)
        hash.update(text)

    // Return hash
    return hash.digest('hex')
}

exports.find_one = (db,key) => {
    return new Promise((resolve,reject) => {
        db.findOne(key, (err,data) => {
            if(err) {
                reject(err)
                return
            }
            resolve(data)
        })
    })
}

// Insert data to MongoDB
exports.insert_data = (db, model) => {
    return new Promise((resolve,reject) => {
        var newData = new db(model)
        newData.save(err => {
            if(err) {
                reject(err)
                return
            }
            resolve('ok')
        })
    })
}