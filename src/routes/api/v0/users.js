const express = require("express")
const router = express.Router();
const actionController = require('../../../controllers/users-controller');
const validationController = require('../../../controllers/users-validation-controller')

//signin
router.post('/signin', validationController.signIn, actionController.signIn);
//login
router.post('/login', validationController.logIn, actionController.logIn);
//update basic infos
router.put('/:id', validationController.updateUserInfo, actionController.updateUserInfo);
//update password
router.put('/:id/password', validationController.updatePassword, actionController.updatePassword);




module.exports = router;
