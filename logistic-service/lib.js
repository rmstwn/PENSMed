// Check if environment variable is defined
exports.env_check = (env, name) => {
    if (env == undefined) {
        console.error(`Please define ${name}`)
        return
    }
}

// Get server start time
exports.localTime = () => {
    let time = new Date()

    return time.toString();
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