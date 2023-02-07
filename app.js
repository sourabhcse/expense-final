const path = require('path');
const express = require('express');
// const helmet=require('helmet')
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
var cors=require('cors')
const sequelize = require('./util/database');

const app = express();
// app.use(helmet())
app.use(cors())
app.use(bodyParser.json());

const User = require('./models/users');
const Expense=require('./models/expenses');
const Order=require('./models/orders');
const Forgotpassword=require('./models/forgotpassword')
const Filelink=require('./models/filelink')

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)


User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Filelink);
Filelink.belongsTo(User)


const UserRoutes=require('./routes/user')
const ExpenseRoutes=require('./routes/expense')
const PremiumRoutes=require('./routes/premium')
const ForgotpasswordRoutes=require('./routes/forgotpassword')
const RazorpayRoutes=require('./routes/razorpay')



app.use(UserRoutes)
app.use(ExpenseRoutes)
app.use(PremiumRoutes)
app.use(ForgotpasswordRoutes)
app.use(RazorpayRoutes)


app.use((req,res)=>{
  console.log('urlll',req.url)
  res.sendFile(path.join(__dirname,`public/views/${req.url}`));
  
})
sequelize
.sync()
.then(result => {
   console.log(result)
   app.listen(4000)
  })
  .catch((err)=>{
    console.log(err)
  })