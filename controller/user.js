const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const moment = require('moment');
const nodemailer = require('nodemailer');

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

module.exports.login = async (req, res) => {
    try {
        if (req.body) {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email: email });

            if (user) {
                const isValidPassword = await bcrypt.compare(password, user.password);

                if (isValidPassword) {
                    const payload = {
                        id: user.id,
                        email: user.email
                    }

                    const token = generateToken(payload);

                    res.json({ token })
                }
                else {
                    res.status(400).json({ message: "Invalid password ", status: 1, response: "error" });
                }
            }
            else {
                res.status(400).json({ message: "Invalid email ", status: 1, response: "error" });
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

module.exports.getAllUsers = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (checkAdmin && checkAdmin.isAdmin) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const userData = await userModel
                .find({ isAdmin: false })
                .skip(skip)
                .limit(limit);

            const totalUsers = await userModel.countDocuments({ isAdmin: false });

            if (userData.length > 0) {
                return res.status(200).json({ msg: userData, currentPage: page, totalPages: Math.ceil(totalUsers / limit), totalUsers, status: 0, response: "success" });
            } else {
                return res.status(404).json({ msg: "User not found", status: 1, response: "error" });
            }
        } else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Something went wrong", status: 1, response: "error" });
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

const path = require("path");
const fs = require("fs");

module.exports.thumbIn = async (req, res) => {
    try {
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
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.getThumbinData = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (checkAdmin && checkAdmin.isAdmin) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const thumbinData = await thumbIns
                .find()
                .skip(skip)
                .limit(limit);

            const totalThumbinData = await thumbIns.countDocuments();

            console.log(totalThumbinData);

            if (totalThumbinData > 0) {
                return res.status(200).json({ msg: thumbinData, currentPage: page, totalPages: Math.ceil(thumbinData / limit), totalThumbinData, status: 0, response: "success" });
            } else {
                return res.status(404).json({ msg: "Thumb-in data not found", status: 1, response: "error" });
            }
        } else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.thumbOut = async (req, res) => {
    try {
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

                const newRecord = await thumbOuts.create(req.body);
                await newRecord.save();

                res.status(200).json({ message: "Data uploaded", status: 0, response: "success" });
            } else {
                res.status(400).json({ message: "Please select an image", status: 1, response: "error" });
            }
        } else {
            res.status(400).json({ message: "Please fill the form", status: 1, response: "error" });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.getThumboutData = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (checkAdmin && checkAdmin.isAdmin) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const thumboutData = await thumbOuts
                .find()
                .skip(skip)
                .limit(limit);

            const totalThumboutData = await thumbOuts.countDocuments();

            if (totalThumboutData > 0) {
                return res.status(200).json({ msg: thumboutData, currentPage: page, totalPages: Math.ceil(thumboutData / limit), totalThumboutData, status: 0, response: "success" });
            } else {
                return res.status(404).json({ msg: "Thumb-in data not found", status: 1, response: "error" });
            }
        } else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.trackLocatoin = async (req, res) => {
    try {
        if (req.body) {
            const newRecord = await locationModel.create(req.body);
            await newRecord.save();

            res.status(200).json({ message: "Data uploaded", status: 0, response: "success" });
        } else {
            res.status(400).json({ message: "Please fill the form", status: 1, response: "error" });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.addOrders = async (req, res) => {
    try {
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
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.getOrders = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (checkAdmin && checkAdmin.isAdmin) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const orderData = await orderModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalOrders = await orderModel.countDocuments();

            if (orderData.length > 0) {
                return res.status(200).json({ msg: orderData, currentPage: page, totalPages: Math.ceil(totalOrders / limit), totalOrders, status: 0, response: "success" });
            } else {
                return res.status(404).json({ msg: "Order not found", status: 1, response: "error" });
            }
        } else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.addPayment = async (req, res) => {
    try {
        if (req.body) {
            req.body.date = moment().format('LLL');

            const newRecord = await paymentModel.create(req.body);
            await newRecord.save();

            res.status(200).json({ message: "Payment added", status: 0, response: "success" });
        } else {
            res.status(400).json({ message: "Payment not added", status: 1, response: "error" });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.getPayments = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (checkAdmin && checkAdmin.isAdmin) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const paymentData = await paymentModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalPayments = await paymentModel.countDocuments();

            if (paymentData.length > 0) {
                return res.status(200).json({ msg: paymentData, currentPage: page, totalPages: Math.ceil(totalPayments / limit), totalPayments, status: 0, response: "success" });
            } else {
                return res.status(404).json({ msg: "Payment data not found", status: 1, response: "error" });
            }
        } else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};

module.exports.travellingTimeline = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (checkAdmin && checkAdmin.isAdmin) {
            const searchByDate = async (date, model, field) => {
                const searchDate = new Date(date);

                if (isNaN(searchDate)) {
                    throw new Error("Invalid Date");
                }

                return await model.find({
                    [field]: {
                        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
                        $lt: new Date(searchDate.setHours(24, 0, 0, 0))
                    }
                });
            };

            const searchDate = req.body.date;

            if (!searchDate || isNaN(new Date(searchDate))) {
                return res.status(400).json({ msg: "Invalid date format", status: 1, response: "error" });
            }

            const models = [
                { model: thumbIns, field: "inDate" },
                { model: thumbOuts, field: "outDate" }
            ];

            const resultData = [];

            for (const { model, field } of models) {
                try {
                    const results = await searchByDate(searchDate, model, field);
                    
                    resultData.push(
                        ...results.map((record) => ({
                            _id: record._id,
                            km: record.km,
                            image: record.image,
                            [field]: record[field],
                            __v: record.__v
                        }))
                    );
                } catch (error) {
                    console.error(`Error querying ${field}:`, error.message);
                }
            }

            return res.status(200).json({
                msg: "Search completed",
                status: 0,
                response: "success",
                data: resultData
            });
        } else {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }
    } catch (error) {
        console.error("Error in travellingTimeline:", error.message);
        return res.status(500).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};