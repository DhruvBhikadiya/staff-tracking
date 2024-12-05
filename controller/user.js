const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const moment = require('moment');
const nodemailer = require('nodemailer');
const path = require("path");
const fs = require("fs");

const { generateToken } = require('../config/JWTtoken.js');

dotenv.config();

// MODEL
const userModel = require('../model/user.js');
const otpModel = require('../model/otp.js');
const thumbIns = require('../model/thumbIns.js');
const thumbOuts = require('../model/thumbOuts.js');
const orderModel = require('../model/order.js');
const paymentModel = require('../model/payment.js');
const locationModel = require('../model/location.js');
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

module.exports.login = async (req, res) => {
    try {
        if (req.body) {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email: email });

            if (user && user.status) {
                const isValidPassword = await bcrypt.compare(password, user.password);

                if (isValidPassword) {
                    const payload = {
                        id: user.id,
                        email: user.email
                    }

                    const token = generateToken(payload);

                    res.json({ token, isAdmin: user.isAdmin, email: user.email, userId: user._id })
                }
                else {
                    res.status(400).json({ message: "Invalid password ", status: 1, response: "error" });
                }
            }
            else {
                res.status(400).json({ message: "User Not Found ", status: 1, response: "error" });
            }
        }
        else {
            res.status(400).json({ message: "Please fill the form", status: 1, response: "error" });
        }
    }
    catch (e) {
        console.log(e);
    }
};

module.exports.registration = async (req, res) => {
    try {
        if (req.body) {
            const checkemail = await userModel.findOne({ email: req.body.email });
            if (!checkemail) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                req.body.status = true;
                let userRegister = await userModel.create(req.body);
                if (userRegister) {
                    return res.status(200).json({ msg: "Data inserted", status: 0, response: "success" });
                }
                else {
                    return res.status(400).json({ msg: "Data not inserted", status: 1, response: "error" });
                }
            }
            else {
                return res.status(400).json({ msg: "Email allready exist", status: 1, response: "error" });
            }
        }
        else {
            return res.status(400).json({ msg: "Please fill the form", status: 1, response: "error" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something wrong", status: 1, response: "error" });
    }
};

module.exports.forgotPassword = async (req, res) => {
    try {
        const checkemail = await userModel.findOne({ email: req.body.email });

        if (checkemail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: "dhruvbhikadiya114@gmail.com",
                    pass: "ehhjbunhmemneyps",
                },
            });
            otp = Math.round(Math.random() * 1000000);
            message = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .message {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="message">
                    <h3>here is your otp :- ${otp} </h3>
                    </div>
                </div>
            </body>
            </html>`
            var mailoptions = {
                from: 'dhruv.bhikadiya@gmail.com',
                to: req.body.email,
                subject: "Account password",
                text: "Hello world?",
                html: message
            }
            req.body.otp = otp;
            transporter.sendMail(mailoptions, async (e, info) => {
                if (e) {
                    console.log(e);
                    return res.status(400).json({ msg: "Email not send", status: 1, response: "error" });
                }
                else {
                    let otpData = await otpModel.create(req.body);
                    if (otpData) {
                        return res.status(200).json({ msg: "Email send", status: 0, response: "success" });
                    }
                    else {
                        return res.status(400).json({ msg: "Email not send", status: 1, response: "error" });
                    }
                }
            })
        }
        else {
            return res.status(400).json({ msg: "Email not found", status: 1, response: "error" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something wrong", status: 1, response: "error" });
    }
};

module.exports.verifyotp = async (req, res) => {
    try {
        let otpData = await otpModel.findOne({ otp: req.body.otp, email: req.params.email });
        if (otpData) {
            return res.status(200).json({ msg: "OTP matched", status: 0, response: "success" });
        }
        else {
            return res.status(400).json({ msg: "OTP not matched", status: 1, response: "error" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something wrong", status: 1, response: "error" });
    }
};

module.exports.changePass = async (req, res) => {
    try {
        if (req.body.npass == req.body.cpass) {
            checkemail = await userModel.findOne({ email: req.params.email });
            if (checkemail) {
                const password = await bcrypt.hash(req.body.cpass, 10);
                let changepass = await userModel.findByIdAndUpdate(checkemail.id, { password: password });
                if (changepass) {
                    return res.status(200).json({ msg: "Password changed", status: 0, response: "success" });
                }
                else {
                    return res.status(400).json({ msg: "Password not changed", status: 1, response: "error" });
                }
            }
            else {
                return res.status(400).json({ msg: "Data not found", status: 1, response: "error" });
            }
        }
        else {
            return res.status(400).json({ msg: "New password and confirm password not matched", status: 1, response: "error" });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something wrong", status: 1, response: "error" });
    }
};

module.exports.thumbIn = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({ _id: req.user.id, isAdmin: false });

        if (checkUser && !checkUser.isAdmin) {
            if (req.body) {
                if (req.file) {
                    const uploadDir = path.join(__dirname, "../uploads/thumbIn");

                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    const uniqueFilename = `thumbIn_${Date.now()}_${req.file.originalname}`;
                    const filePath = path.join(uploadDir, uniqueFilename);

                    fs.writeFileSync(filePath, req.file.buffer);

                    req.body.image = `/uploads/thumbIn/${uniqueFilename}`;
                    req.body.userId = new ObjectId(req.user.id);
                    const newRecord = await thumbIns.create(req.body);
                    await newRecord.save();

                    res.status(200).json({
                        message: "Data uploaded",
                        status: 0,
                        response: "success"
                    });
                } else {
                    res.status(400).json({ message: "Please select an image", status: 1, response: "error" });
                }
            } else {
                res.status(400).json({ message: "Please fill the form", status: 1, response: "error" });
            }
        }
        else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.thumbOut = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({ _id: req.user.id, isAdmin: false });

        if (checkUser && !checkUser.isAdmin) {
            if (req.body) {
                if (req.file) {
                    const uploadDir = path.join(__dirname, "../uploads/thumbOut");

                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    const uniqueFilename = `thumbOut_${Date.now()}_${req.file.originalname}`;
                    const filePath = path.join(uploadDir, uniqueFilename);

                    fs.writeFileSync(filePath, req.file.buffer);

                    req.body.image = `/uploads/thumbOut/${uniqueFilename}`;
                    req.body.userId = new ObjectId(req.user.id);
                    const newRecord = await thumbOuts.create(req.body);
                    await newRecord.save();

                    res.status(200).json({ message: "Data uploaded", status: 0, response: "success" });
                } else {
                    res.status(400).json({ message: "Please select an image", status: 1, response: "error" });
                }
            } else {
                res.status(400).json({ message: "Please fill the form", status: 1, response: "error" });
            }
        }
        else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.trackLocation = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({ _id: req.user.id, isAdmin: false });

        if (checkUser && !checkUser.isAdmin) {
            console.log(req.body);
            if (req.body && Array.isArray(req.body)) {
                const locationRecords = req.body.map(record => ({
                    ...record,
                    userId: new ObjectId(req.user.id)
                }));

                await locationModel.insertMany(locationRecords);

                res.status(200).json({ message: "Data uploaded", status: 0, response: "success" });
            } else {
                res.status(400).json({ message: "Please provide valid data", status: 1, response: "error" });
            }
        } else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.addOrders = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({ _id: req.user.id, isAdmin: false });

        if (checkUser && !checkUser.isAdmin) {
            if (req.body) {
                if (req.file) {
                    const uploadDir = path.join(__dirname, "../uploads/orders");

                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    const uniqueFilename = `orders_${Date.now()}_${req.file.originalname}`;
                    const filePath = path.join(uploadDir, uniqueFilename);

                    fs.writeFileSync(filePath, req.file.buffer);

                    req.body.image = `/uploads/orders/${uniqueFilename}`;

                    const newRecord = await orderModel.create(req.body);
                    await newRecord.save();

                    res.status(200).json({ message: "Data uploaded", status: 0, response: "success" });
                } else {
                    res.status(400).json({ message: "Please select an image", status: 1, response: "error" });
                }
            } else {
                res.status(400).json({ message: "Please fill the form", status: 1, response: "error" });
            }
        }
        else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.addPayment = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({ _id: req.user.id, isAdmin: false });

        if (checkUser && !checkUser.isAdmin) {
            if (req.body) {
                req.body.date = moment().format('LLL');

                const newRecord = await paymentModel.create(req.body);
                await newRecord.save();

                res.status(200).json({ message: "Payment added", status: 0, response: "success" });
            } else {
                res.status(400).json({ message: "Payment not added", status: 1, response: "error" });
            }
        }
        else{
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.getUserInfo = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({ _id: req.user.id, isAdmin: false });

        if (!checkUser || checkUser.isAdmin) {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }

        const searchByDate = async (date, userid, model, field) => {

            const searchDate = new Date(date);

            if (isNaN(searchDate)) {
                throw new Error("Invalid Date");
            }

            const data = await model.find({
                $and: [
                    {
                        [field]: {
                            $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
                            $lt: new Date(searchDate.setHours(24, 0, 0, 0))
                        }
                    },
                    {
                        userId: userid
                    }
                ]
            }).sort({ createdAt: 1 });

            if (data.length === 0) {
                console.warn(`No records found for date: ${date}, userId: ${userid}`);
                return null;
            }

            return {
                userId: data[0].userId,
                kiloMeter: data[0].km,
                image: data[0].image,
                [field]: data[0][field]
            };
        };

        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];
        const model = [
            { model: thumbIns, fields: 'inDate' },
            { model: thumbOuts, fields: 'outDate' }
        ];

        let data = {};

        const userName = await userModel.find({ _id: req.user.id });

        data.userName = userName[0].name;

        for (const m of model) {
            const results = await searchByDate(todayDate, req.user.id, m.model, m.fields);
            if (results) {
                if (m.fields === 'inDate') {
                    data['inThumb'] = results;
                }
                else if (m.fields === 'outDate') {
                    data['outThumb'] = results;
                }
            } else {
                if (m.fields === 'inDate') {
                    data['inThumb'] = null;
                }
                else if (m.fields === 'outDate') {
                    data['outThumb'] = null;
                }
            }
        }

        return res.status(200).json({
            msg: "Search completed",
            status: 0,
            response: "success",
            data
        });

    } catch (e) {
        console.error("Error in getUserInfo:", e.message);
        return res.status(500).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};
