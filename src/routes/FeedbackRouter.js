const express = require('express');
const router = express.Router();
const checkAuth=require("../middleware/check-auth");
const feedback=require("../modals/feedbackdata")
const order=require("../modals/orderdata")
const rent=require("../modals/rentbookData")
var ObjectId = require('mongodb').ObjectID;


router.get('/rewiewOrNot/:id/:loginId',async(req, res)=>{
    console.log("bookid=========>",req.params.id);
   console.log(req.params.loginId);
   const rentUser=await rent.findOne({book_id:req.params.id,login_id:req.params.loginId});
        
        if(rentUser){
            return res.status(200).json({
                success: true,
                error: false,
                message: "Item Found!"
            })
        }
   

   order.aggregate([
    {$unwind:"$bookdata"},
    {$match: { "bookdata.book_id" : ObjectId(req.params.id)}},
    {$match: { "bookdata.login_id": ObjectId(req.params.loginId)}},
   
       
     ])  .then(function (data) {
        console.log(data);
        if (data != 0) {
            return res.status(200).json({
                success: true,
                error: false,
                message: "Item Found!"
            })
        }
        else {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Item Found!"
            })
          
        }
    })
})


router.post('/add-feedback',checkAuth,((req,res)=>{
    console.log(req.body);
    var item = {
        login_id:req.userData.userId,
        book_id:req.body.book_id,
        name:req.body.name,
        feedback:req.body.feedback,
       status:"0"
    }
    console.log(item);
    var products=feedback(item);
    products.save().then(()=>{
        res.status(200).json({
            success:true,
            error:false,
            message:'Feedback Added!'
        })
    })
    .catch(err=>{
        return res.status(401).json({
            message: "Auth failed.please login"
        })
    })
}))


router.get('/admin-view-feedback', (req, res) => {
    feedback.aggregate([
     {
        $lookup:
         {
            from: 'book_tbs',
            localField: 'book_id',
            foreignField: '_id',
            as: 'bookData'
         }
    },
    {
        $unwind:'$bookData'
    },  
    
     ])
        .then(function (data) {
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

router.get('/view-feedback', (req, res) => {
   
    feedback.aggregate([
     {
        $lookup:
         {
            from: 'book_tbs',
            localField: 'book_id',
            foreignField: '_id',
            as: 'bookData'
         }
    },
    {
        $unwind:'$bookData'
    },  
    {
        $match:
        {
            status:"1"
        }
    }
     ])
        .then(function (data) {
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


router.post('/approve-feedback/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    feedback.updateOne(  { _id:id} , { $set: { status : 1  } } ).then((user)=>{
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

router.delete('/delete-feedback/:id', (req, res) => {
    const id = req.params.id   // login id 
    
    feedback.deleteOne({ _id: id })
        .then(function () {
            res.status(200).json({
                success: true,
                error: false,
                message: 'Review deleted!'
            })
        })
  
        .catch(err => {
            return res.status(401).json({
                message: "Something went Wrong!"
            })
        })
})
module.exports=router;