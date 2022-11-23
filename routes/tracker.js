const path=require('path');
const express=require('express')
const userauthentication=require('../middleware/auth')
const expenseController=require('../controllers/expense')
const router=express.Router();
router.post('/add-expense', userauthentication.authenticate,expenseController.postexpense);
router.get('/get-expense/:expe', userauthentication.authenticate ,expenseController.getexpense);
router.delete('/delete-expense/:id', expenseController.deleteexpense);
//router.get('/edit-expence/:id', expenceController.getEditexpence);
router.get('/download',userauthentication.authenticate,expenseController.downloadexpense)
router.post('/edit-expense/:id', expenseController.postEditexpense);

module.exports=router;
