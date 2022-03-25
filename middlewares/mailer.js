const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,               
    host: "smtp.gmail.com",
    auth: {
            user: 'contactrazerist@gmail.com',
            pass: 'mbzbsooclzxjmnkh',
        },
    secure: true,
});

module.exports = {
    transporter
}