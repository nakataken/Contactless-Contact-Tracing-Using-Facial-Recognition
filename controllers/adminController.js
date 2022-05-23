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
    res.render('./Administrator Module/dashboard');
}

const dashboard_data_get = async (req, res) => {
    let visitors = await Visitor.count();
    let establishments = await Establishment.count();
    let vaccinated = await Visitor.countDocuments({isVaccinated: true});
    let limited = await Establishment.countDocuments({limitVaccinated: true});
    
    let records = await Record.find();

    res.json({visitors, establishments, vaccinated, limited});
}


const create_log = async (records, visitors) => {
    let logs = [];

    for (const record of records) {
        for (const visitor of visitors) {
            if(record.visitor_id === visitor._id.toString()) {
                let establishment = await Establishment.findById({_id:record.establishment_id});
                const log = {
                    id: record._id, 
                    visitor_id: record.visitor_id,
                    name: visitor.name,
                    establishment: establishment.name, 
                    date: record.createdAt
                };
                logs.push(log);
            }
        }
    }

    return logs;
}

// RECORDS
const records_get = (req, res) => {
    res.render('./Administrator Module/records');
}

const records_log_get = async (req, res) => {
    let records = await Record.find();
    let visitors = await Visitor.find();
    let logs = [];

    logs = await create_log(records, visitors);

    res.json({success: true, logs});
}

const records_visitors_filter_post = async (req, res) => {
    let {option, id, date1, date2, time1, time2} = req.body;
    let logs = [];
    let records = [];
    let visitors = await Visitor.find();
    
    if(!time1) time1 = "00:00";
    if(!time2) time2 = "23:59";

    if(option == "byDate") {
        let queryDate1 = new Date(`${date1} ${time1}:00`);
        let queryDate2 = new Date(`${date2} ${time2}:00`);
        records = await Record.find({visitor_id:id, createdAt: { $gte: queryDate1, $lt: queryDate2}})
    } else {
        // get data byTime
        let queryDate1 = new Date(`${date1} ${time1}:00`);
        let queryDate2 = new Date(`${date1} ${time2}:00`);
        records = await Record.find({visitor_id:id, createdAt: { $gte: queryDate1, $lt: queryDate2}})
    }

    logs = await create_log(records, visitors);
    res.json({success:true, logs});
}

const records_establishments_filter_post = async (req, res) => {
    let {option, id, date1, date2, time1, time2} = req.body;
    let logs = [];
    let records = [];
    let visitors = await Visitor.find();

    if(!time1) time1 = "00:00";
    if(!time2) time2 = "23:59";

    if(option == "byDate") {
        let queryDate1 = new Date(`${date1} ${time1}:00`);
        let queryDate2 = new Date(`${date2} ${time2}:00`);
        records = await Record.find({establishment_id: id, createdAt: { $gte: queryDate1, $lt: queryDate2}})
    } else {
        // get data byTime
        let queryDate1 = new Date(`${date1} ${time1}:00`);
        let queryDate2 = new Date(`${date1} ${time2}:00`);
        records = await Record.find({establishment_id: id, createdAt: { $gte: queryDate1, $lt: queryDate2}})
    }

    logs = await create_log(records, visitors);

    res.json({success:true, logs});
}

const records_trace_get = async (req, res) => {
    let record = await Record.findOne({_id: req.params.id});
    let visitors = await Visitor.find();

    let date = record.createdAt.toISOString().slice(0, 10);
    let queryDate1 = new Date(`${date}T00:00:00.00Z`);
    let queryDate2 = new Date(`${date}T23:59:59.00Z`);
    let trace = await Record.find({establishment_id:record.establishment_id, createdAt: { $gte: queryDate1, $lt: queryDate2}})

    logs = await create_log(trace, visitors);

    res.json({success:true, logs});
}

// VISITORS
const visitors_get = async (req, res) => {
    res.render('./Administrator Module/visitors');
}

const visitors_list_get = async (req, res) => {
    let visitors = await Visitor.find();
    res.json({visitors});
}

const visitors_vaccination_status_put = async (req, res) => {
    try {
        Visitor.updateOne({_id:req.params.id}, {$set:{isVaccinated: true}}, (error, visitor) => {
            if(error) throw error;
            if(visitor) {
                res.status(200).json({success:true});
            } else {
                res.status(404).json({success:false});
            }
        })
    } catch (error) {
        console.log(error.message);

    }
}

// ESTABLISHMENTS
const establishments_get = async (req, res) => {
    let establishments = await Establishment.find();
    res.json({establishments});
}

const establishments_requests_get = async (req, res) => {
    let requests = await Request.find();
    res.render('./Administrator Module/Establishments/request', {requests})
}

const unlinkPermit = (filename) => {
    fs.unlink(`./public/uploads/permit/${filename}`, (error) => {
        if (error) return;
    })
}

const unlinkValidID = (filename) => {
    fs.unlink(`./public/uploads/validID/${filename}`, (error) => {
        if (error) return;
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
                    name: _.upperCase(request.name),
                    owner: _.upperCase(request.owner),
                    address: _.upperCase(request.address),
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
                        res.redirect('/admin/establishments/requests');
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
            res.redirect('/admin/establishments/requests');
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
    dashboard_data_get,
    // Records
    records_get,
    records_log_get,
    records_visitors_filter_post,
    records_establishments_filter_post,
    records_trace_get,
    // Visitors
    visitors_get,
    visitors_list_get,
    visitors_vaccination_status_put,
    // Establishments
    establishments_get,
    establishments_requests_get,
    establishments_request_post,
    establishments_list_get
}