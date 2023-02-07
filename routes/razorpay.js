const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth');
const razorpayController=require('../controllers/razorpay')
router.get('/purchase/premiummembership',auth,razorpayController.getPurchase)
router.post('/purchase/updatetransactionstatus',auth,razorpayController.getUpdate)
module.exports=router;