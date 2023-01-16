const mongoose = require('mongoose')
mongoose.connect('mongodb://raheena:raheena%40123@cluster1-shard-00-00.zmtjd.mongodb.net:27017,cluster1-shard-00-01.zmtjd.mongodb.net:27017,cluster1-shard-00-02.zmtjd.mongodb.net:27017/bookrental?ssl=true&replicaSet=atlas-5vyr6c-shard-0&authSource=admin&retryWrites=true&w=majority') 
const Schema = mongoose.Schema    //schema definition

const rentbookSchema = new Schema({
    login_id:{type:Schema.Types.ObjectId,ref:"login_tb"},
    book_id:{type:Schema.Types.ObjectId,ref:"book_tb"},
    date:{ type: String, required: true },
    price:{ type: String, required: true },
    duedate:{ type: String, required: true }, 
})

var rentbookdata = mongoose.model('rentbook_tb',rentbookSchema) //model creation
module.exports=rentbookdata;