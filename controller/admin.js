const dotenv = require('dotenv');

dotenv.config();

// MODEL
const userModel = require('../model/user.js');
const thumbIns = require('../model/thumbIns.js');
const thumbOuts = require('../model/thumbOuts.js');
const orderModel = require('../model/order.js');
const paymentModel = require('../model/payment.js');
const locationModel = require('../model/location.js');

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

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

module.exports.getThumbinData = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (checkAdmin && checkAdmin.isAdmin) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const thumbinData = await thumbIns
                .find({ userId: req.query.userId })
                .skip(skip)
                .limit(limit);

            console.log(thumbinData, '-- thumbinData-- ');

            const totalThumbinData = await thumbIns.countDocuments();

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

module.exports.getThumboutData = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (checkAdmin && checkAdmin.isAdmin) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const thumboutData = await thumbOuts
                .find({ userId: req.query.userId })
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

module.exports.mapView = async (req, res) => {
    try {
        const checkAdmin = await userModel.findOne({ _id: req.user.id, isAdmin: true });

        if (!checkAdmin || !checkAdmin.isAdmin) {
            return res.status(403).json({ msg: "Unauthorized user", status: 1, response: "error" });
        }

        try {
            const data = await locationModel.aggregate([
                {
                    "$addFields": {
                        "formattedDate": {
                            "$dateToString": {
                                "format": "%Y-%m-%d",
                                "date": "$timestamp"
                            }
                        }
                    }
                },
                {
                    "$match": {
                        "formattedDate": req.query.date,
                        "userId": new ObjectId(req.query.userid)
                    }
                },
                {
                    "$project": {
                        _id: 0,
                        lat: 1,
                        long: 1,
                        timestamp: 1
                    }
                },
                {
                    $sort: {
                        "timestamp": 1
                    }
                }
            ]);

            console.log(data.length);

            const calculateDistance = (coordinates) => {
                const R = 6371;

                const toRadians = (degrees) => (degrees * Math.PI) / 180;

                let totalDistance = 0;

                for (let i = 0; i < coordinates.length - 1; i++) {
                    const { lat: lat1, long: lon1 } = coordinates[i];
                    const { lat: lat2, long: lon2 } = coordinates[i + 1];

                    const dLat = toRadians(lat2 - lat1);
                    const dLon = toRadians(lon2 - lon1);

                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(toRadians(lat1)) *
                        Math.cos(toRadians(lat2)) *
                        Math.sin(dLon / 2) *
                        Math.sin(dLon / 2);

                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                    const distance = R * c;
                    totalDistance += distance;
                }

                return totalDistance;
            };

            const totalDistance = calculateDistance(data);

            return res.status(200).json({
                msg: "Search completed",
                status: 0,
                response: "success",
                kiloMeter: totalDistance.toFixed(2),
                data
            });
        } catch (error) {
            console.error(`Error querying timestamp field:`, error);
            return res.status(400).json({
                msg: "Error",
                status: 0,
                response: "error",
                error
            });
        }
    } catch (error) {
        console.error("Error in travellingTimeline:", error.message);
        return res.status(500).json({ msg: "Something went wrong", status: 1, response: "error" });
    }
};
