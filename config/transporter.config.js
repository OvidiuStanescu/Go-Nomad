const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ovidiuleonst@gmail.com',
        pass: 'kgoszwwtxohzlizc'
    }
})

module.exports = transporter