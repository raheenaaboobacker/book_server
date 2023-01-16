const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const registerRouter = require('./src/routes/registerRouter');
const loginRouter=require('./src/routes/loginRouter')
const bookRouter = require('./src/routes/bookRouter');
const cartRouter = require('./src/routes/cartRouter');
const orderRouter = require('./src/routes/orderRouter');
const adminRouter = require('./src/routes/adminRouter');
const feedbackRouter = require('./src/routes/FeedbackRouter');

const port = 5000;
 
const app = express();
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cors());

app.use('/',loginRouter);
app.use('/register',registerRouter);
app.use('/book',bookRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);
app.use('/admin',adminRouter);
app.use('/feedback',feedbackRouter);


app.listen(port,function(){
    console.log("server running on localhost: "+ port);
});