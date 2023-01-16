const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const checkAuth=require("../middleware/check-auth");
const book=require("../modals/bookdata")
const category=require("../modals/categorydata")
const login=require("../modals/logindata")
const order=require("../modals/orderdata")
const multer=require("multer")
var ObjectId = require('mongodb').ObjectID;

var storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"../client/public/upload")
    },
    filename: function(req,file,cb){
        cb(null,req.body.name)
    }
})

var upload=multer({storage:storage})
router.post('/upload',upload.single("file"),(req,res)=>{
return res.json("file uploaded")
})

router.post('/add-category',((req,res)=>{
    console.log(req.body);
    var item = {
        category:req.body.category,
      
    }
    console.log(item);
    var products=category(item);
    products.save().then(()=>{
        res.status(200).json({
            success:true,
            error:false,
            message:'Category Added!'
        })
    })
    .catch(err=>{
        return res.status(401).json({
            message: "Something went wrong"
        })
    })
}))

router.get('/view-category', (req, res) => {
    category.find()
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

router.post('/addBook',checkAuth,((req,res)=>{
    console.log(req.body);
    var item = {
        login_id:req.userData.userId,
        status:0,
        category:req.body.category,
        title:req.body.title,
        author:req.body.author,
        price:req.body.price,
        publisher:req.body.publisher,
        pages:req.body.pages,
        desc:req.body.desc,
        language:req.body.language,
        image:req.body.image,
        pdf:"null",
        pdfstatus:"0",
        pdfprice:"null"
    }
    console.log(item);
    var products=book(item);
    products.save().then(()=>{
        res.status(200).json({
            success:true,
            error:false,
            message:'Book Added!'
        })
    })
    .catch(err=>{
        return res.status(401).json({
            message: "Auth failed.please login"
        })
    })
}))

router.get('/admin-view-books', (req, res) => {
    book.find()
    .then( (data)=> {
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



router.get('/view-books', (req, res) => {
    book.aggregate([{
        $lookup:{
            from: "book_tbs",
            localField: "_id",
            foreignField: "login_id",
            as: "bookdata"
          }
    }, {
        $match:
        {
            status:1
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

router.get('/view-category-books/:category', (req, res) => {
    const category=req.params.category;
    console.log(category);
    book.aggregate([{
        $lookup:{
            from: "book_tbs",
            localField: "_id",
            foreignField: "login_id",
            as: "bookdata"
          }
    }, {
        $match:
        {
            status:1
        }
    }, {
        $match:
        {
            category:category
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


router.post('/approve-book/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    book.updateOne(  { _id:id} , { $set: { status : 1  } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"book approved"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})

router.post('/approve-pdf/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    book.updateOne(  { _id:id} , { $set: { pdfstatus :"1"  } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"pdf approved"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})
router.delete('/delete-book/:id', (req, res) => {
    const id = req.params.id   // login id 
   
        book.deleteOne({ _id: id })
        .then(function () {
            res.status(200).json({
                success: true,
                error: false,
                message: 'Book deleted!'
            })
        })

        .catch(err => {
            return res.status(401).json({
                message: "Something went Wrong!"
            })
        })
})

router.get('/singleitem/:id',(req,res)=>{
    const id = req.params.id
    book.find({_id:id})
    .then((data)=>{
        res.status(200).json({
            success:true,
            error:false,
            data:data
        })   
     })
   
})

router.get('/admin-view-user/:id',(req,res)=>{
    const id = req.params.id
    login.find({_id:id})
    .then((data)=>{
        res.status(200).json({
            success:true,
            error:false,
            data:data
        })   
     })
   
})

router.get('/view-feedback/:id',(req,res)=>{
    const id = req.params.id
    book.aggregate([
        {
           $lookup:
            {
               from: 'feedback_tbs',
               localField: '_id',
               foreignField: 'book_id',
               as: 'feedbackData'
            }
       },
       {
           $unwind:'$feedbackData'
       },  
       {
           $match:
           {
               _id:ObjectId(id)
           }
       }
        ])
    .then((data)=>{
        console.log(data);
        res.status(200).json({
            success:true,
            error:false,
            data:data
        })   
     })
   
})


router.get('/view-user-books',checkAuth, (req, res) => {
    var id=req.userData.userId;
    login.aggregate([{
        $lookup:{
            from: "book_tbs",
            localField: "_id",
            foreignField: "login_id",
            as: "bookdata"
          }
    },
    {
        $unwind:'$bookdata'
    },  
    {
        $match:
        {
            _id:ObjectId(id)
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
    })  .catch(err=>{
            return res.status(401).json({
                message: "Auth failed",
                error: err
            })
        })

})

router.get('/admin-view-user-books/:id', (req, res) => {
    var id=req.params.id;
    console.log(id);
    login.aggregate([{
        $lookup:{
            from: "book_tbs",
            localField: "_id",
            foreignField: "login_id",
            as: "bookdata"
          }
    },
    {
        $unwind:'$bookdata'
    },  
    {
        $match:
        {
            _id:ObjectId(id)
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


router.post('/add-pdf/:id',((req,res)=>{
    console.log("data",req.body.pdf);
    if(req.body.pdf==null){
      
        res.status(401).json({
            message: "Please Choose Pdf"
        })
    }
    else{
        book.updateOne( { _id:req.params.id} , { $set: { pdf : req.body.pdf ,pdfprice : req.body.pdfprice  }}).then(()=>{
            res.status(200).json({
                success:true,
                error:false,
                message:'Pdf Added!'
            })
        })
        .catch(err=>{
            return res.status(401).json({
                message: "Something went wrong"
            })
        })
    }
}))

router.get('/view-book-order-details/:id', (req, res) => {
    var id=req.params.id;
    book.aggregate([
        {
          '$lookup': {
            'from': 'order_tbs', 
            'localField': '_id', 
            'foreignField': 'bookdata.book_id', 
            'as': 'orderData'
          }
        },
        {
            $unwind:'$orderData'
        },
       
        {
            $match:
            {
                _id:ObjectId(id)
            }
        },
        
        {
            "$group": {
                "_id": "$_id",
                "orderData": { "$first": "$orderData" },
                 
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

router.get('/view-book-rental-details/:id', (req, res) => {
    var id=req.params.id;
    book.aggregate([
         {
          '$lookup': {
            'from': 'rentbook_tbs', 
            'localField': '_id', 
            'foreignField': 'book_id', 
            'as': 'rentData'
          }
        },
        {
            $unwind:'$rentData'
        },
        {
            $match:
            {
                _id:ObjectId(id)
            }
        },
        
        {
            "$group": {
                "_id": "$rentData._id",
                "rentData": { "$first": "$rentData" },
                 
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

router.get('/view-orders/:id', (req, res) => {
    const id=req.params.id
    console.log(id);
    order.aggregate([
    {$unwind:"$bookdata"},
    // {$match: { "$order.bookdata.book_id" : id}},
    // {
    // $lookup: {
    //     from: 'book_tbs',
    //     localField: 'bookdata.book_id',
    //     foreignField: '_id',
    //     as: 'orderBookData'
    // }
    // },
    // {
    //     $unwind:'$orderBookData'
    // }, 
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
        // {
        //     "$group": {
        //         // "_id": "$login_id",
        //         "bookData": { "$first": "$bookdata" },
        //         "status": { "$first": "$orderstatus" },
        //          "username":{ "$first": "$userData.username" },
        //     }
        // }
     ])
    
// book.aggregate([
//     {$match: {_id: ObjectId(id)}},
//     {
//       $lookup: {
//         from: "order_tbs",
//         as: "orderData",
//         pipeline: [
//         { $project: {
//               bookdata: {
//                 $first: {
//                   $filter: {
//                     input: "$bookdata",
//                     cond: {$eq:  ["$order_tbs.bookdata.book_id", "$id"]}
//                   }
//                 }
//               }
//             }
//           }
//         ]
//       }
//     },
//     // {
//     //   $project: {
//     //     title: 1,
//     //     feeling: {$first: "$orderData"},
//     //     // status: {$first: "$orderData.movies.status"}
//     //   }
//     // }
//   ])
//   order.aggregate([
    
//     {$unwind:"$bookdata"},
//     // {$unwind:"$profile.products"},
//     // {$unwind:"$profile.products.profile"},
    
//     // {'$lookup': { from: 'products', localField: 'profile.products.product', foreignField: '_id', as: 'products' } },
//     // {$unwind:"$products"},
//     // //{$unwind:"$products"},
//     // //{$unwind:"$products.internals"},
//     // {$addFields: { "products.profile_id": '$profile.products.profile'}},
    
//     // {'$lookup': { from: 'products.internals', localField: 'products.profile_id', foreignField: '_id', as: 'internalsArray' } },
    
//     // {
//     //     '$project': {
//     //     name: 1,
//     //     products: {
//     //       _id: "$products._id",
//     //       name: "$products.name",
//     //       profile_id : 1,
//     //     },
//     //     productsId: 1,
//     //       "internals": { _id: "$products.internals._id" , name: "$products.internals.name" },
//     //         internalsArray : 1,
//     //     }
//     // }
//     ])
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