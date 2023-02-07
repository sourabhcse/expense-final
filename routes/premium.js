const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth');
const premiumController=require('../controllers/premium')
router.get('/premium/showLeaderBoard',auth,premiumController.getPremium)
module.exports=router;