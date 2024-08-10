import express from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { loginUser, logoutUser, registerUser,protectedRoute } from '../controllers/authController';
import authenticateJWT from '../middlewares/authHandler';


const router = express.Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/logout', asyncHandler(logoutUser));
router.get('/protected', authenticateJWT,asyncHandler(protectedRoute));




export default router;

