const express = require("express")
const router = express.Router();
const actionController = require('../../../controllers/classes-controller');
const validationController = require('../../../controllers/classes-validation-controller');

//get all classes
router.get('/', actionController.getClasses);
//get class by teacher
router.get('/search', validationController.getClassByTeacher, actionController.getClassByTeacher);
//get class by id
router.get('/:id', validationController.getClassById, actionController.getClassById);
//detele class
router.delete('/:id',validationController.deleteClass, actionController.deleteClass);
router.put('/:id', validationController.insertClass, actionController.updateClass);
router.post('/', validationController.insertClass, actionController.insertClass);
router.post('/:id/book', validationController.booking, actionController.bookClass);
router.post('/:id/unbook', validationController.booking, actionController.unbookClass);


module.exports = router;