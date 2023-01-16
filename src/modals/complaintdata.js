const mongoose = require('mongoose')
mongoose.connect('mongodb://raheena:raheena%40123@cluster1-shard-00-00.zmtjd.mongodb.net:27017,cluster1-shard-00-01.zmtjd.mongodb.net:27017,cluster1-shard-00-02.zmtjd.mongodb.net:27017/bookrental?ssl=true&replicaSet=atlas-5vyr6c-shard-0&authSource=admin&retryWrites=true&w=majority') 
const Schema = mongoose.Schema    //schema definition

const ComplaintSchema = new Schema({
    phone: String,
    email: String,
    msg: String,
})

var Complaintdata = mongoose.model('complaint_tb',ComplaintSchema) //model creation
module.exports=Complaintdata;