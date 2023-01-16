const mongoose = require('mongoose')
mongoose.connect('mongodb://raheena:raheena%40123@cluster1-shard-00-00.zmtjd.mongodb.net:27017,cluster1-shard-00-01.zmtjd.mongodb.net:27017,cluster1-shard-00-02.zmtjd.mongodb.net:27017/bookrental?ssl=true&replicaSet=atlas-5vyr6c-shard-0&authSource=admin&retryWrites=true&w=majority') 
const Schema = mongoose.Schema    //schema definition

const bookSchema = new Schema({
    login_id:{type:Schema.Types.ObjectId,ref:"login_tb"},
    status:{ type: Number, required: true },
    category:{ type: String, required: true },
     title:{ type: String, required: true },   
     publisher:{ type: String, required: true },   
     price:{ type: String, required: true },   
     author:{ type: String, required: true },
     pages:{ type: String, required: true },   
     desc:{ type: String, required: true },   
     language:{ type: String, required: true },   
     pdf:{ type: String },   
     pdfstatus:{ type: String },   
     pdfprice:{ type: String },   
     image:{ type: String, required: true },   
   
})

var bookdata = mongoose.model('book_tb',bookSchema) //model creation
module.exports=bookdata;