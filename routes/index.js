'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');
const { isAuthenticated, isSeller, isGuest } = require('../middlewares/auth');
 
// Auth routes
router.get('/register', isGuest, authController.showRegister);
router.post('/register', isGuest, authController.register);
router.get('/login', isGuest, authController.showLogin);
router.post('/login', isGuest, authController.login);
router.get('/logout', authController.logout);
 
// Landing page - GET route 1
router.get('/', itemController.index);
 
// Item routes (seller only) - GET route 2
router.get('/items', isAuthenticated, isSeller, itemController.myItems);
router.get('/items/add', isAuthenticated, isSeller, itemController.showAdd);
router.post('/items/add', isAuthenticated, isSeller, itemController.upload, itemController.addItem);
router.get('/items/:id/edit', isAuthenticated, isSeller, itemController.showEdit);
router.post('/items/:id/edit', isAuthenticated, isSeller, itemController.upload, itemController.editItem);
router.post('/items/:id/delete', isAuthenticated, isSeller, itemController.deleteItem);
 
module.exports = router;