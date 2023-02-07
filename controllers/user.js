const User = require('../models/users');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const AWS=require('aws-sdk')
const Filelink=require('../models/filelink')
const Expense=require('../models/expenses');
function isstringinvalid(string){
    if(string==undefined || string.length==0){
        return true
    }else{
        return false
    }
}
function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,name:name,ispremiumuser:ispremiumuser},process.env.TOKEN)

}
function uploadToS3(data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        // Bucket:BUCKET_NAME
    })
    var params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log('something went wrong',err)
                reject(err)

            }
            else{
                // console.log('success',s3response)
                resolve(s3response.Location);
            }
    })
    })



}
exports.postSignup=async(req,res,next)=>{
    try{
    console.log(req.body)
    const {name,email,password} = req.body
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
        res.status(400).json({err:'bad parameter....something went wrong'})
    }
//     const existinguser=User.findOne({email})
//     if(existinguser) return res.status(400).json('user already exists')
    
    const saltrounds=10
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        await User.create({name,email,password:hash})
        res.status(201).json({message:'succesfully create new user'})
    })


}
    catch{(err)=>{
        return res.status(500).json(err)
    }}
}
exports.postLogin=async(req,res,next)=>{
    try{
    const{email,password}=req.body;
    console.log(password)
    console.log(process.env.token)
    if(isstringinvalid(email) || isstringinvalid(password)){
        res.status(400).json({message:'email or password is missing',success:false})
    }
    const user=await User.findAll({where:{email}})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(err){
                    throw new Error('something went wrong')
                }
                if(result===true){
                    res.status(200).json({success:true,message:'user logged in successfully',token:generateAccessToken(user[0].id,user[0].name,user[0].ispremiumuser)})
                }else{
                    return res.status(400).json({success:false,message:'password is incorrect'})
                }
            })

        }else{
            return res.status(404).json({success:false,message:'user doesnot exist'})
        }
    
   } catch{err=>{
        res.status(500).json({message:err,success:false})
    }}
}
exports.getDownload=async(req,res,next)=>{
    if(!req.user.ispremiumuser){
        return res.status(400).json({message:'only for premium user'})
    }
    try{

    const expenses=await req.user.getExpenses()
    // console.log(expenses)
    const stringifiedExpenses=JSON.stringify(expenses)
    // depend on the users
    const userId=req.user.id;
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileURl=await uploadToS3(stringifiedExpenses,filename)
    console.log(fileURl)
    await req.user.createFilelink({fileURl:fileURl})
   
    res.status(200).json({fileURl,success:true})
    }
    catch(err){
        res.status(500).json({fileURl:'',success:false,err:err})
    }

}
