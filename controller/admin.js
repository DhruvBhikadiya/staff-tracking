const dotenv = require("dotenv");
const { ObjectId } = require('mongoose').Types;

dotenv.config();

// MODEL
const userModel = require("../model/user.js");
const thumbIns = require("../model/thumbIns.js");
const thumbOuts = require("../model/thumbOuts.js");
const orderModel = require("../model/order.js");
const paymentModel = require("../model/payment.js");
const locationModel = require("../model/location.js");
const allownceModel = require("../model/allownce.js");

module.exports.getAllUsers = async (req, res) => {
  try {
    const checkAdmin = await userModel.findOne({
      _id: req.user.id,
      isAdmin: true,
    });

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
        return res.status(200).json({
          msg: userData,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          status: 0,
          response: "success",
        });
      } else {
        return res
          .status(404)
          .json({ msg: "User not found", status: 1, response: "error" });
      }
    } else {
      return res
        .status(403)
        .json({ msg: "Unauthorized user", status: 1, response: "error" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ msg: "Something went wrong", status: 1, response: "error" });
  }
};

module.exports.getThumbinData = async (req, res) => {
  try {
    const checkAdmin = await userModel.findOne({
      _id: req.user.id,
      isAdmin: true,
    });

    if (checkAdmin && checkAdmin.isAdmin) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const thumbinData = await thumbIns
        .find({ userId: req.query.userId })
        .sort({ inDate: -1 })
        .skip(skip)
        .limit(limit);

      const totalThumbinData = await thumbIns.countDocuments();

      if (totalThumbinData > 0) {
        return res.status(200).json({
          msg: thumbinData,
          currentPage: page,
          totalPages: Math.ceil(thumbinData / limit),
          totalThumbinData,
          status: 0,
          response: "success",
        });
      } else {
        return res.status(404).json({
          msg: "Thumb-in data not found",
          status: 1,
          response: "error",
        });
      }
    } else {
      return res
        .status(403)
        .json({ msg: "Unauthorized user", status: 1, response: "error" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ msg: "Something went wrong", status: 1, response: "error" });
  }
};

module.exports.getThumboutData = async (req, res) => {
  try {
    const checkAdmin = await userModel.findOne({
      _id: req.user.id,
      isAdmin: true,
    });

    if (checkAdmin && checkAdmin.isAdmin) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const thumboutData = await thumbOuts
        .find({ userId: req.query.userId })
        .sort({ outDate: -1 })
        .skip(skip)
        .limit(limit);

      const totalThumboutData = await thumbOuts.countDocuments();

      if (totalThumboutData > 0) {
        return res.status(200).json({
          msg: thumboutData,
          currentPage: page,
          totalPages: Math.ceil(thumboutData / limit),
          totalThumboutData,
          status: 0,
          response: "success",
        });
      } else {
        return res.status(404).json({
          msg: "Thumb-in data not found",
          status: 1,
          response: "error",
        });
      }
    } else {
      return res
        .status(403)
        .json({ msg: "Unauthorized user", status: 1, response: "error" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ msg: "Something went wrong", status: 1, response: "error" });
  }
};

module.exports.getOrders = async (req, res) => {
  try {
    const checkAdmin = await userModel.findOne({
      _id: req.user.id,
      isAdmin: true,
    });

    if (checkAdmin && checkAdmin.isAdmin) {
      const filter = {};
      const isValidDate = (date) => !isNaN(new Date(date).valueOf());

      if (req.query.fromDate && req.query.toDate) {
        if (isValidDate(req.query.fromDate) && isValidDate(req.query.toDate)) {
          filter.date = {
            $gte: new Date(req.query.fromDate),
            $lte: new Date(req.query.toDate),
          };
        } else {
          return res.status(400).json({
            msg: "Invalid date format",
            status: 1,
            response: "error",
          });
        }
      }

      if (req.query.userId) {
        filter.userId = new ObjectId(req.query.userId);
      }

      const orderData = await orderModel.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        {
          $addFields: {
            userId: { $arrayElemAt: ["$userId.name", 0] },
            clientId: { $arrayElemAt: ["$clientId.client_name", 0] },
          },
        },
      ]);

      const totalOrders = await orderModel.countDocuments(filter);

      if (orderData.length > 0) {
        return res.status(200).json({
          orders: orderData,
          totalOrders: orderData.length,
          status: 0,
          response: "success",
        });
      } else {
        return res.status(200).json({
          orders: [],
          totalOrders: 0,
          status: 1,
          response: "error",
        });
      }
    } else {
      return res.status(403).json({
        msg: "Unauthorized user",
        status: 1,
        response: "error",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      msg: "Something went wrong",
      status: 1,
      response: "error",
    });
  }
};

module.exports.getPayments = async (req, res) => {
  try {
    const checkAdmin = await userModel.findOne({
      _id: req.user.id,
      isAdmin: true,
    });

    if (checkAdmin && checkAdmin.isAdmin) {
      const filter = {};
      const isValidDate = (date) => !isNaN(new Date(date).valueOf());

      // Validate and apply date filter
      if (req.query.fromDate && req.query.toDate) {
        if (isValidDate(req.query.fromDate) && isValidDate(req.query.toDate)) {
          filter.date = {
            $gte: new Date(req.query.fromDate),
            $lte: new Date(req.query.toDate),
          };
        } else {
          return res.status(400).json({
            msg: "Invalid date format",
            status: 1,
            response: "error",
          });
        }
      }

      if (req.query.userId) {
        filter.userId = new ObjectId(req.query.userId);
      }

      const paymentData = await paymentModel.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        {
          $addFields: {
            userId: { $arrayElemAt: ["$userId.name", 0] },
            clientId: { $arrayElemAt: ["$clientId.client_name", 0] },
          },
        },
      ]);

      if (paymentData.length > 0) {
        return res.status(200).json({
          payments: paymentData,
          totalPayments: paymentData.length,
          status: 0,
          response: "success",
        });
      } else {
        return res.status(200).json({
          payments: [],
          totalPayments: 0,
          status: 1,
          response: "error",
        });
      }
    } else {
      return res.status(403).json({
        msg: "Unauthorized user",
        status: 1,
        response: "error",
      });
    }
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).json({
      msg: "Something went wrong",
      status: 1,
      response: "error",
    });
  }
};

module.exports.mapView = async (req, res) => {
  try {
    const checkAdmin = await userModel.findOne({
      _id: req.user.id,
      isAdmin: true,
    });

    if (!checkAdmin || !checkAdmin.isAdmin) {
      return res
        .status(403)
        .json({ msg: "Unauthorized user", status: 1, response: "error" });
    }

    try {
      const data = await locationModel.aggregate([
        {
          $addFields: {
            formattedDate: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$timestamp",
              },
            },
          },
        },
        {
          $match: {
            formattedDate: req.query.date,
            userId: new ObjectId(req.query.userid),
          },
        },
        {
          $project: {
            _id: 0,
            lat: 1,
            long: 1,
            timestamp: 1,
          },
        },
        {
          $sort: {
            timestamp: 1,
          },
        },
      ]);

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
        data,
      });
    } catch (error) {
      console.error(`Error querying timestamp field:`, error);
      return res.status(400).json({
        msg: "Error",
        status: 0,
        response: "error",
        error,
      });
    }
  } catch (error) {
    console.error("Error in travellingTimeline:", error.message);
    return res
      .status(500)
      .json({ msg: "Something went wrong", status: 1, response: "error" });
  }
};

module.exports.getAllowncewUsers = async (req, res) => {
  try {
    const checkAdmin = await userModel.findOne({
      _id: req.user.id,
      isAdmin: true,
    });

    if (checkAdmin && checkAdmin.isAdmin) {
      const startDate = new Date(req.body.stDate);
      const endDate = new Date(req.body.enDate);

      const allownceUsers = await allownceModel.aggregate([
        {
          $match:
          {
            userId: new ObjectId(
              req.body.userId
            ),
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          "$lookup": {
            "from": "users",
            "localField": "userId",
            "foreignField": "_id",
            "as": "userData"
          }
        },
        {
          "$addFields": {
            "userName": { "$arrayElemAt": ["$userData.name", 0] }
          }
        },
        {
          "$project": {
            "userId": 1,
            "userName": 1,
            "type": 1,
            "amount": 1,
            "image": 1,
            "date": {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            }
          }
        }
      ]);

      if (allownceUsers.length > 0) {
        return res.status(200).json({
          data: allownceUsers,
          status: 0,
          response: "success",
        });
      } else {
        return res
          .status(404)
          .json({ msg: "Users allownce not found", status: 1, response: "error" });
      }
    } else {
      return res
        .status(403)
        .json({ msg: "Unauthorized user", status: 1, response: "error" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ msg: "Something went wrong", status: 1, response: "error" });
  }
};

module.exports.getInOutThumbDetails = async (req, res) => {
  try {
    const checkAdmin = await userModel.findOne({
      _id: req.user.id,
      isAdmin: true,
    });

    if (checkAdmin && checkAdmin.isAdmin) {
      const startDate = new Date(req.body.stDate);
      const endDate = new Date(req.body.enDate);

      const inOutThumbDetails = await thumbIns.aggregate([
        {
          $match: {
            userId: new ObjectId(req.body.userId),
            inDate: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $sort: {
            inDate: -1
          }
        },
        {
          $project: {
            userId: 1,
            inkm: "$km",
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$inDate",
              },
            },
          },
        },
        {
          "$lookup": {
            "from": "thumbouts",
            "let": { "matchDate": "$date", "matchUser": "$userId" },
            "pipeline": [
              {
                "$addFields": {
                  "formattedThumboutDate": {
                    "$dateToString": {
                      "format": "%Y-%m-%d",
                      "date": "$outDate"
                    }
                  }
                }
              },
              {
                "$match": {
                  "$expr": {
                    "$and": [
                      { "$eq": ["$formattedThumboutDate", "$$matchDate"] },
                      { "$eq": ["$userId", "$$matchUser"] }
                    ]
                  }
                }
              },
              {
                "$project": { "km": 1, "_id": 0 }
              }
            ],
            "as": "result"
          }
        },
        {
          "$addFields": {
            "outkm": {
              "$ifNull": [{ "$arrayElemAt": ["$result.km", 0] }, 0]
            }
          }
        },
        {
          $addFields: {
            diffrence: { $subtract: ["$outkm", "$inkm"] }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData"
          }
        },
        {
          $sort: {
            inDate: -1
          }
        },
        {
          "$addFields": {
            "userName": { "$arrayElemAt": ["$userData.name", 0] }
          }
        },
        {
          $project: {
            result: 0,
            userData: 0
          }
        }
      ]);

      if (inOutThumbDetails.length > 0) {
        return res.status(200).json({
          data: inOutThumbDetails,
          status: 0,
          response: "success",
        });
      } else {
        return res
          .status(404)
          .json({ msg: "Users allownce not found", status: 1, response: "error" });
      }
    } else {
      return res
        .status(403)
        .json({ msg: "Unauthorized user", status: 1, response: "error" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ msg: "Something went wrong", status: 1, response: "error" });
  }
};
