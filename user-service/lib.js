// Check if environment variable is defined
exports.env_check = (env, name) => {
    if (env == undefined) {
        console.error(`Please define ${name}`)
        return
    }
}

// Check if request if defined
exports.request_check = (request,name) => {
    if (request == undefined || request == '')
        return Promise.reject(`Please define ${name}`)
        
    return Promise.resolve('ok')
}

// Check MySQL/MariaDB Connection
exports.mysql_connection = pool => {
    pool.getConnection((err,conn) => {
        if(err) {
            console.error(err)
            return
        }
        // Release connection
        conn.release()
    })
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

// Sending email
exports.send_mail = async (recipient,mail) => {
    // Import nodemailer module
    const nodemailer = require('nodemailer')
    
    // SMTP configuration
    let transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    // Sending mail
    let info = await transport.sendMail({
        from: `"${process.env.SMTP_EMAIL}" <${process.env.SMTP_EMAIL}>`,
        to: recipient,
        subject: mail.subject,
        text: mail.content,
        html: mail.content
    })
}