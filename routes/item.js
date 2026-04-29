'use strict';
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { isAuthenticated, isSeller } = require('../middlewares/auth');

router.get('/items', isAuthenticated, isSeller, itemController.myItems);
router.get('/items/add', isAuthenticated, isSeller, itemController.showAdd);
router.post('/items/add', isAuthenticated, isSeller, itemController.upload, itemController.addItem);
router.get('/items/:id/edit', isAuthenticated, isSeller, itemController.showEdit);
router.post('/items/:id/edit', isAuthenticated, isSeller, itemController.upload, itemController.editItem);
router.post('/items/:id/delete', isAuthenticated, isSeller, itemController.deleteItem);

module.exports = router;
