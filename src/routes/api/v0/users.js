const express = require("express")
const router = express.Router();
const actionController = require('../../../controllers/users-controller');
const validationController = require('../../../controllers/users-validation-controller')
// router.post('/login', controller.login.post)
router.post('/signin', validationController.signIn, actionController.signIn);
router.post('/login', validationController.logIn, actionController.logIn);


module.exports = router;
