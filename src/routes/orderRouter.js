const express = require('express');
const router = express.Router();
const cart=require("../modals/cartdata")
const order = require('../modals/orderdata')
const rentbook = require('../modals/rentbookData')

const checkAuth=require("../middleware/check-auth");
var ObjectId = require('mongodb').ObjectID;


router.post('/orderbook',checkAuth,(req, res)=>{
    console.log(req.body);
   console.log(req.userData.userId);
   cart.find({login_id:req.userData.userId})
   .then(result=>{
    let cartdata=result
    console.log(cartdata);
    cart.deleteMany({login_id:req.userData.userId})
    .then(data=>{
        console.log(data);
           var item={
            login_id:req.userData.userId,
            bookdata:cartdata,
            address:req.body,
            date : new Date().toDateString(),
            orderstatus:"ordered",
            deliverydate:null

        }
        console.log(item);
        var books=order(item);
        books.save().then(()=>{
            res.status(200).json({
                success:true,
                error:false,
                message:'Payment Successfull!!'
            })
        })
    })
   })

})

router.get('/viewOrderItems',checkAuth, (req, res) => {
    var id=req.userData.userId;
    order.aggregate([{
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
        $match:
        {
            login_id:ObjectId(id)
        }
    }
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

router.post('/rent-book',checkAuth,(req, res)=>{
    console.log(req.body);
   console.log(req.userData.userId);
   
           var item={
            login_id:req.userData.userId,
            book_id:req.body.id,
            price:req.body.price,
            date : new Date().toDateString(),
            duedate:req.body.duedate


        }
        console.log(item);
        var books=rentbook(item);
        books.save().then(()=>{
            res.status(200).json({
                success:true,
                error:false,
                message:'Payment Successfull!'
            })
        })
})



router.get('/view-rent-book',checkAuth, (req, res) => {
    var id=req.userData.userId;
    rentbook.aggregate([{
        $lookup: {
            from: 'book_tbs',
            localField: 'book_id',
            foreignField: '_id',
            as: 'BookData'
        }
    },
    {
        $unwind:'$BookData'
    },  
    {
        $match:
        {
            login_id:ObjectId(id)
        }
    }
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



router.get('/vol-view-rent-book', (req, res) => {
  
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
                from: 'register_tbs',
                localField: 'login_id',
                foreignField: 'login_id',
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

router.post('/shipped/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    order.updateOne(  { _id:id} , { $set: { orderstatus : "Shipped" } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"Shipped"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})

router.post('/delivered/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    order.updateOne(  { _id:id} , { $set: { orderstatus : "delivered" ,deliverydate:new Date().toDateString(),  } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"delivered"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})
module.exports = router;