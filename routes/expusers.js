const path = require('path');

const express = require('express');

const userController = require('../controllers/expuser');

const router = express.Router();
router.post('/user/signup', userController.newuser);
router.post('/user/login', userController.existinguser);
module.exports=router;