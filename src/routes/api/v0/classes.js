const express = require("express")
const router = express.Router();
const actionController = require('../../../controllers/classes-controller');
const validationController = require('../../../controllers/classes-validation-controller');

//get all classes
router.get('/', actionController.getClasses);
//get class by teacher or name
router.get('/search', validationController.getClassByQuery, actionController.getClassByQuery);
//get class by id
router.get('/:id', validationController.getClassById, actionController.getClassById);
//detele class
router.delete('/:id',validationController.deleteClass, actionController.deleteClass);
//update class
router.put('/:id', validationController.insertClass, actionController.updateClass);
//post class
router.post('/', validationController.insertClass, actionController.insertClass);
//book class
router.post('/:id/book', validationController.booking, actionController.bookClass);
//unbook class
router.post('/:id/unbook', validationController.booking, actionController.unbookClass);


module.exports = router;