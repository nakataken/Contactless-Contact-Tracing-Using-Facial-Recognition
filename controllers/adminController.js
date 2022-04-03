const Request = require("../models/Request.js");
const Establishment = require("../models/Establishment.js");
const Visitor = require("../models/Visitor.js");
const Record = require("../models/Record.js");
const fs = require('fs');
const _ = require('lodash');
const mailer = require("../middlewares/mailer.js");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const index_get = (req, res) => {
    res.redirect('/admin/dashboard');
}

const logout_get = (req, res) => {
    res.cookie('jwtAdmin', '', {maxAge: 1});
    res.redirect('/');
}

const dashboard_get = async (req, res) => {
    let visitorsCount = await Visitor.count();
    let establishmentsCount = await Establishment.count();

    res.render('./Administrator Module/dashboard', {visitorsCount, establishmentsCount});
}

// VISITORS
const visitors_records_get = async (req, res) => {
    let records = await Record.find();
    let visitors = await Visitor.find();
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

    res.render('./Administrator Module/Visitors/records', {logs});
}

const visitors_trace_get = async (req, res) => {
    res.render('./Administrator Module/Visitors/trace');
}

const visitors_list_get = async (req, res) => {
    res.render('./Administrator Module/Visitors/list');
}

// ESTABLISHMENTS
const establishments_requests_get = async (req, res) => {
    let requests = await Request.find();
    res.render('./Administrator Module/Establishments/request', {requests})
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

const establishments_request_post = async (req, res) => {
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
            // text: `Please change your account information immediately. Email: ${request.email} Password: ${password}`,
            html: `<div><h1>Please change your account password immediately.</h1></br><p><strong>Email: ${request.email}</strong></p></br><p><strong>Password: ${password}<strong></p></div>`
        };

        mailer.transporter.sendMail(mailData, async function (err, info) {
            if(err) {
                console.log(err)
            } else {
                const establishment = new Establishment({
                    name: _.lowerCase(request.name),
                    owner: _.lowerCase(request.owner),
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
        // Manage email options
        const mailData = {
            from: 'contactrazerist@gmail.com',  // sender address
            to: request.email,   // list of receivers
            subject: 'Establishment account creation',
            html: `<div><h1>Your account creation request is rejected.</h1><ul><li>Establishment information is not valid.</li><li>Business Permit image not clear or valid.</li><li>Valid ID image not clear or valid.</li></ul></div>`
        };

        mailer.transporter.sendMail(mailData, async function (err, info) {
            if(err) return
            // Delete data on db and files
            await Request.deleteOne({_id:req.params.id})
            unlinkPermit(request.permit);
            unlinkValidID(request.validID);
            res.redirect('/admin/requests');
        })
    }
}

const establishments_list_get = async (req, res) => {
    res.render('./Administrator Module/Establishments/list')
}

module.exports = {
    index_get,
    logout_get,
    dashboard_get,
    visitors_records_get,
    visitors_trace_get,
    visitors_list_get,
    establishments_requests_get,
    establishments_request_post,
    establishments_list_get
}