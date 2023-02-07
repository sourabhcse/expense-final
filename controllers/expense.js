const Expense=require('../models/expenses');
function isstringinvalid(string){
    if(string==undefined || string.length==0){
        return true
    }else{
        return false
    }
}
exports.postExpense=async(req,res,next)=>{
    try{
    const{expenseamount,description,category}=req.body;
   
    console.log(expenseamount,description,category)

    if(isstringinvalid(expenseamount) || isstringinvalid(description) || isstringinvalid(category)){
        return res.status(400).json({success:false,message:'parameter is missing'})
    }
    // req.user.createExpense({expenseamount,description,category})
    await Expense.create({expenseamount,description,category,userId:req.user.id})
    .then(expense=>{
        return res.status(201).json({expense,success:true})
    })
}
    catch{err=>{
        return res.status(500).json({success:false,error:err})
    }
}

}
exports.getExpense=async(req,res,next)=>{
    // req.user.getExpenses().then(result=>{
    //     console.log(result)
    // })
    const page = +req.query.page || 1;
    const NUMBER_OF_EXPENSES_PER_PAGE=3;
    let total_items
    Expense.count({where:{userId:req.user.id}})
    .then((total)=>{
        total_items=total
        return Expense.findAll({where:{userId:req.user.id},offset:(page-1)*NUMBER_OF_EXPENSES_PER_PAGE,
        limit:NUMBER_OF_EXPENSES_PER_PAGE})
    })
   

    .then(expenses=>{
          const pagination={
            currentPage:page,
            hasNextPage:NUMBER_OF_EXPENSES_PER_PAGE *page<total_items,
            nextPage:page + 1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            lastPage:Math.ceil(total_items/NUMBER_OF_EXPENSES_PER_PAGE),

        }
        res.status(200).json({expenses,pagination,success:true})
    })
    .catch(err=>{
        res.status(500).json({error:err,success:false})
    })
}
exports.deleteExpense=async(req,res,next)=>{
    const expenseid=req.params.expenseid;
    if(isstringinvalid(expenseid)){
       return res.status(400).json({success:false,message:'bad parameter'})
    }
    Expense.destroy({where:{id:expenseid,userId:req.user.id}}).then((noofrows)=>{
        if(noofrows===0){
            return res.status(400).json({success:false,message:'user doesnot belong to their expenses'})
        }
        return res.status(200).json({success:true,message:'Deleted successfully'})
    })
    .catch(err=>{
        return res.status(500).json({success:false,message:"failed"})
    })
}