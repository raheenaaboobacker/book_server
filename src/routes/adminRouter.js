const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const checkAuth=require("../middleware/check-auth");
const order=require("../modals/orderdata")
const login=require("../modals/logindata")
const user=require("../modals/registerdata")
const publisher=require("../modals/publisherData")
const complaint=require("../modals/complaintdata")

router.get('/view-users', (req, res) => {
    login.aggregate([
        {
          $lookup:
          {
            from:'register_tbs',
            localField:'_id',
            foreignField:'login_id',
                     
            as:"registerdetails"
          }
        },
        {
            $match:
            {
                role:2
            }
        }
       
    ]).then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})

router.get('/view-volunteers', (req, res) => {
    login.aggregate([
        {
          $lookup:
          {
            from:'volunteer_tbs',
            localField:'_id',
            foreignField:'login_id',
                     
            as:"registerdetails"
          }
        },
        {
            $match:
            {
                role:3
            }
        }
       
    ]).then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})


router.delete('/delete-user/:id', (req, res) => {
    const id = req.params.id   // login id 
    login.deleteOne({ _id: id }) .then(function () {
    user.deleteOne({ login_id: id })
        .then(function () {
            res.status(200).json({
                success: true,
                error: false,
                message: 'user deleted!'
            })
        })
    })
        .catch(err => {
            return res.status(401).json({
                message: "Something went Wrong!"
            })
        })
})

router.post('/approve/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    login.updateOne(  { _id:id} , { $set: { status : 1  } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"approved"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})

router.get('/view-publisher', (req, res) => {
    login.aggregate([
        {
          $lookup:
          {
            from:'publisher_tbs',
            localField:'_id',
            foreignField:'login_id',
                     
            as:"registerdetails"
          }
        },
        {
            $match:
            {
                role:4
            }
        }
       
    ]).then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})

router.delete('/delete-publisher/:id', (req, res) => {
    const id = req.params.id   // login id 
    login.deleteOne({ _id: id }) .then(function () {
        publisher.deleteOne({ login_id: id })
        .then(function () {
            res.status(200).json({
                success: true,
                error: false,
                message: 'user deleted!'
            })
        })
    })
        .catch(err => {
            return res.status(401).json({
                message: "Something went Wrong!"
            })
        })
})
router.get('/view-message', (req, res) => {
    complaint.find().then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})

router.get('/view-orders', (req, res) => {
        order.aggregate([
        {
        $lookup: {
            from: 'book_tbs',
            localField: 'bookdata.book_id',
            foreignField: '_id',
            as: 'orderBookData'
        }
        },
        {
            $unwind:'$orderBookData'
        }, 
        {
            $lookup: {
                from: 'login_tbs',
                localField: 'login_id',
                foreignField: '_id',
                as: 'userData'
            }
            },
            {
                $unwind:'$userData'
            },  
        
         ])
            .then(function (data) {
                console.log(data);
                if (data == 0) {
                    return res.status(401).json({
                        success: false,
                        error: true,
                        message: "No Item Found!"
                    })
                }
                else {
                    return res.status(200).json({
                        success: true,
                        error: false,
                        data: data
                    })
                }
            })
    
    })

   
module.exports=router;