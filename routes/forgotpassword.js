const express=require('express')
const router=express.Router()
const forgotpasswordController=require('../controllers/forgotpassword')
router.use('/password/forgotpassword',forgotpasswordController.getForgotpassword)
router.get('/password/resetpassword/:id',forgotpasswordController.getResetpassword)
router.get('/password/updatepassword/:resetpasswordid',forgotpasswordController.getUpdatepassword)
module.exports=router;