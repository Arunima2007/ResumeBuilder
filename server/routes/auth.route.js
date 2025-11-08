// const express = require('express');
// const { googleSignIn } = require('../controllers/auth.controller');

// const router = express.Router();

// //google sign-in
// router.post('/google-sign-in', googleSignIn);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { 
    googleSignIn, 
    login, 
    addSecondaryEmail, 
    verifySecondaryEmail, 
    removeSecondaryEmail, 
    getUserEmails 
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');

// Public routes - Changed from '/google-signin' to '/google-sign-in'
router.post('/google-sign-in', googleSignIn);
router.post('/login', login);

// Protected routes (require authentication)
router.post('/add-secondary-email', protect, addSecondaryEmail);
router.post('/verify-secondary-email', protect, verifySecondaryEmail);
router.post('/remove-secondary-email', protect, removeSecondaryEmail);
router.get('/emails', protect, getUserEmails);

module.exports = router;