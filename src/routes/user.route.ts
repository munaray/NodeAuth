import { Router } from "express";
import {
	activateUser,
	userRegistration,
	userLogin,
	userLogout,
	updateAccessToken,
	getUserInfo,
	socialAuth,
	updateUserInfo,
	updatePassword,
	updateProfilePicture,
} from "../controllers/user.controller";
import { validateUserRegistration } from "../middleware/validator/user.validator";
import { authorizeRoles, isAuthenticated } from "../middleware/authenticate";

const router = Router();

/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.post("/signup", validateUserRegistration, userRegistration);

/**
 * @swagger
 * /api/v1/activate-user:
 *   post:
 *     summary: Activate a user account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userActivationCode:
 *                 type: string
 *                 example: "3718"
 *                 description: The activation code sent to the user's email.
 *               userActivationToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJBYmR1bHNhbGFtIFNhJ2FkIiwiZW1haWwiOiJkdW1teTEyMTUyMjVAZ21haWwuY29tIiwicGFzc3dvcmQiOiJtdW5haENvZGUxc2lkLmNvbSJ9LCJhY3RpdmF0aW9uQ29kZSI6IjM3MTgiLCJpYXQiOjE3MjIzMTcxNjMsImV4cCI6MTcyMjMxNzc2M30.sqfUJU92hSOU-6alpygdgrxhmdmkHMMitpPdiPmShFg"
 *                 description: The token generated for user activation.
 *     responses:
 *       201:
 *         description: User activated successfully
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid activation code or token"
 */

router.post("/activate-user", activateUser);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "janedoe@gmail.com"
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "janeDoe1sid.com"
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the user
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                   format: email
 *                 avatar:
 *                   type: object
 *                   properties:
 *                     public_id:
 *                       type: string
 *                       description: Public ID of the user's avatar
 *                     url:
 *                       type: string
 *                       description: URL of the user's avatar
 *                 role:
 *                   type: string
 *                   description: Role of the user, defaults to "user"
 *                   example: "user"
 *                 isVerified:
 *                   type: boolean
 *                   description: Whether the user is verified
 *                   default: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the user was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the user was last updated
 *                 accessToken:
 *                   type: string
 *                   description: JWT token for authentication.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       400:
 *         description: Bad request, invalid login credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
 */

router.post("/login", userLogin);

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [User]
 *     responses:
 *       201:
 *         description: You've logged out successfully
 *       401:
 *         description: Your token has expired, please log in again.
 */
router.post("/logout", isAuthenticated, userLogout);

/**
 * @swagger
 * /api/v1/logout:
 *   get:
 *     summary: Log out a user
 *     tags: [User]
 *     responses:
 *       201:
 *         description: You've logged out successfully
 *       401:
 *         description: Your token has expired, please log in again.
 */
router.get("/refresh-token", updateAccessToken);
router.get("/me", isAuthenticated, getUserInfo);
router.post("/social-auth", socialAuth);
router.put("/update-user-info", isAuthenticated, updateUserInfo);
router.put("/update-user-password", isAuthenticated, updatePassword);
router.put("/update-user-avatar", isAuthenticated, updateProfilePicture);

export default router;
