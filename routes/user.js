const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();
router.post('/user/add-user', userController.postuser);
router.get('/user/get-users',userController.getuser);
router.delete('/user/delete-user/:id',userController.deleteuser)

module.exports=router;