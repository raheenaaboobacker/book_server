const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const checkAuth=require("../middleware/check-auth");
const cart=require("../modals/cartdata")
var ObjectId = require('mongodb').ObjectID;

router.post('/addCartItem',checkAuth,((req,res)=>{
    console.log(req.body);
    var item = {
        login_id:req.userData.userId,
        book_id:req.body.bookId,
         qty:req.body.qty,
         price:req.body.price,
       
    }
    console.log(item);
    var products=cart(item);
    products.save().then(()=>{
        res.status(200).json({
            success:true,
            error:false,
            message:'Added to cart!'
        })
    })
    .catch(err=>{
        return res.status(401).json({
            message: "Auth failed.please login"
        })
    })
}))

router.get('/viewCartItem',checkAuth, (req, res) => {
    var id=req.userData.userId;
    cart.aggregate([
     {
        $lookup:
         {
            from: 'book_tbs',
            localField: 'book_id',
            foreignField: '_id',
            as: 'cartData'
         }
    },
    {
        $unwind:'$cartData'
    },  
    {
        $match:
        {
            login_id:ObjectId(id)
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
router.post("/updatecartqty",checkAuth,((req,res)=>{
  
    console.log(req.body);
    cart.updateOne({_id:req.body.id},{$set:{qty:req.body.qty}})
     .then(()=>{
        res.status(200).json({
            success:true,
            error:false,
            message:'updated!'
        })
    })
}))
router.delete("/deletecartitem/:id",checkAuth,((req,res)=>{
  const id=req.params.id
    console.log(id);
    cart.deleteOne({_id:id})
     .then(()=>{
        res.status(200).json({
            success:true,
            error:false,
            message:'deleted!'
        })
    })
}))
// router.get('/singleitem/:id',(req,res)=>{
//     const id = req.params.id
//     book.find({_id:id})
//     .then((data)=>{
//         res.status(200).json({
//             success:true,
//             error:false,
//             data:data
//         })   
//      })
   
// })
module.exports=router;