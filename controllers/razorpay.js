const jwt=require('jsonwebtoken');
const Razorpay=require('razorpay')
const Order=require('../models/orders');
const User = require('../models/users');
function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,name:name,ispremiumuser:ispremiumuser},process.env.TOKEN)

}
exports.getPurchase=async(req,res)=>{
    try{
        
    var rzp = new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET
    })
    const amount=2500;
    rzp.orders.create({amount,currency:"INR"},(err,order)=>{
        if(err){
            throw new Error(JSON.stringify(err));
        }
        req.user.createOrder({orderid:order.id,status:'PENDING'}).then(()=>{
            return res.json({order,key_id:rzp.key_id});
        }).catch(err=>{
            throw new Error(err)
        })
    })
}catch{
    console.log(err)
    res.status(500).json({message:'something went wrong',error:err})
}

}
exports.getUpdate=async(req,res,next)=>{
    try{
    const userId=req.user.id;
    const{payment_id,order_id}=req.body;
    const order= await Order.findOne({where:{orderid:order_id}})
        order.update({paymentid:payment_id,status:'SUCCESSFULL'}).then(()=>{
            req.user.update({ispremiumuser:true}).then(()=>{
              
                return res.status(202).json({success:true,message:"Transaction Successful",token:generateAccessToken(userId,undefined,true)})
            }).catch((err)=>{
                throw new Error(err);
            })
        }).catch((err)=>{
            throw new Error(err)
        })
   
}catch{
    res.status(500).json({message:'something went wrong',error:err})
}
}