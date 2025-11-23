const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authorize } = require('../middleware/authMiddleware');

router.get('/users', authorize('admin'), adminController.getUsers);

module.exports = router;
