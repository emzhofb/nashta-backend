var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getMethod);
router.post('/', indexController.postMethod);
router.put('/:id', indexController.editMethod);
router.delete('/:id', indexController.deleteMethod);
router.post('/upload', indexController.saveFile);

module.exports = router;
