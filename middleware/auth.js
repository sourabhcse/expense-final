const jwt=require('jsonwebtoken');
const User = require('../models/users');


const auth=async(req,res,next) =>{
    try{
    
        const token=req.header('Authorization');
        console.log(token)
        const user=jwt.verify(token,process.env.TOKEN)
        console.log(user.userId)
        User.findByPk(user.userId).then((user=>{
            
            req.user=user;
            console.log(req.user)
            next();
        }))    

    .catch(err=>{
        return res.status(500).json({success:false})
    })
}catch(err){
    console.log(err)
    res.status(500).json({success:false})

}   
    
}
module.exports=auth;