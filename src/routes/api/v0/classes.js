const express = require("express")
const router = express.Router();
const actionController = require('../../../controllers/classes-controller');
const validationController = require('../../../controllers/classes-validation-controller');


router.get('/', actionController.getClasses);
router.get('/', (req,res ) => res.send('hello'));


router.get('/search', actionController.getClassByTeacher);
router.get('/:id', actionController.getClassById);

router.delete('/:id', actionController.deleteClass);

router.put('/:id', validationController.insertClass, actionController.updateClass);

router.post('', validationController.insertClass, actionController.insertClass);
router.post('/:id/book', actionController.bookClass);
router.post('/:id/unbook', actionController.unbookClass);

module.exports = router;