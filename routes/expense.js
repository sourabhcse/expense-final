const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth');
const expenseController=require('../controllers/expense')
router.post('/expense/addexpense',auth,expenseController.postExpense)
router.get('/expense/getexpenses',auth,expenseController.getExpense)
router.delete('/expense/deleteexpense/:expenseid',auth,expenseController.deleteExpense)
module.exports=router;