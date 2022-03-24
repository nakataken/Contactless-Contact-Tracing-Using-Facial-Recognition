const Request = require("../models/Request.js");
const Establishment = require("../models/Establishment.js");
const Visitor = require("../models/Visitor.js");
const Record = require("../models/Record.js");
const fs = require('fs');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

const saltRounds = 10;

const transporter = nodemailer.createTransport({
    port: 465,               
    host: "smtp.gmail.com",
    auth: {
            user: 'contactrazerist@gmail.com',
            pass: 'mbzbsooclzxjmnkh',
        },
    secure: true,
});

const index_get = (req, res) => {
    res.redirect('/admin/dashboard');
}

const requests_get = async (req, res) => {
    let requests = await Request.find();
    res.render('./Administrator Module/request', {requests})
}

const unlinkPermit = (filename) => {
    fs.unlink(`./public/uploads/permit/${filename}`, (error) => {
        if (error) {
            console.error(error)
            return
        }
    })
}

const unlinkValidID = (filename) => {
    fs.unlink(`./public/uploads/validID/${filename}`, (error) => {
        if (error) {
            console.error(error)
            return
        }
    })
}

const request_post = async (req, res) => {
    const request = await Request.findById(req.params.id);
    const status = req.body.status;

    if(status === "approve") {
        // Generate random password
        var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var passwordLength = 8;
        var password = "";
        
        for (var i = 0; i <= passwordLength; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber +1);
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Manage email options
        const mailData = {
            from: 'contactrazerist@gmail.com',  // sender address
            to: request.email,   // list of receivers
            subject: 'Establishment account creation',
            text: `Email: ${request.email} Password: ${password}`
        };

        transporter.sendMail(mailData, async function (err, info) {
            if(err) {
                console.log(err)
            } else {
                const establishment = new Establishment({
                    name: request.name,
                    owner: request.owner,
                    address: request.address,
                    email: request.email,
                    contact: request.contact,
                    password: hashedPassword
                });

                establishment.save( async (err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        // Delete data on db and files
                        await Request.deleteOne({_id:req.params.id})
                        unlinkPermit(request.permit);
                        unlinkValidID(request.validID);
                        res.redirect('/admin/requests');
                    }
                })
            }
        });
    } else {
        // Delete data on db and files
        await Request.deleteOne({_id:req.params.id})
        unlinkPermit(request.permit);
        unlinkValidID(request.validID);
        res.redirect('/admin/requests');
    }
}

const logout_get = (req, res) => {
    res.cookie('jwtAdmin', '', {maxAge: 1});
    res.redirect('/');
}

// Data Visualization
const dashboard_get = async (req, res) => {
    let records = await Record.find();
    let visitors = await Visitor.find();
    let recordsCount = records.length;
    let logs = [];
    
    for (const record of records) {
        for (const visitor of visitors) {
            if(record.visitor_id === visitor._id.toString()) {
                let establishment = await Establishment.findById({_id:record.establishment_id});

                const log = {
                    id: record.visitor_id, 
                    name: `${visitor.name.fname} ${visitor.name.mi} ${visitor.name.lname}`,
                    establishment: establishment.name, 
                    date: record.createdAt
                };
                logs.push(log);
            }
        }
    }

    res.render('./Administrator Module/dashboard', {logs, recordsCount});
}

const search_get = (req, res) => {
    
}

module.exports = {
    index_get,
    logout_get,
    dashboard_get,
    requests_get,
    request_post,
    search_get
}