import swaggerJSDoc from "swagger-jsdoc";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the user
 *         email:
 *           type: string
 *           description: Email address of the user
 *           format: email
 *         password:
 *           type: string
 *           description: User's password (hashed, not returned by default)
 *           format: password
 *         avatar:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               description: Public ID of the user's avatar
 *             url:
 *               type: string
 *               description: URL of the user's avatar
 *           description: Avatar of the user
 *         role:
 *           type: string
 *           description: Role of the user, defaults to "user"
 *           example: user
 *         isVerified:
 *           type: boolean
 *           description: Whether the user is verified
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *       example:
 *         name: Jane Doe
 *         email: janedoe@example.com
 *         password: hashedPassword123.com
 *
 */

const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Learning management system api",
			description:
				"This LMS API provides endpoints for managing users, courses, enrollments, assessments, and progress tracking, enabling educators and administrators to automate workflows and customize learning experiences. The API is built with scalability and flexibility in mind, supporting diverse educational environments while maintaining secure access to data and functionality.",
			contact: {
				name: "munaray",
			},
			servers: [{ url: "http://localhost:5000" }],
		},
		schemes: ["http", "https"],
	},
	apis: [
		"./src/routes/*.js",
		"./src/routes/*.ts",
		`${__dirname}/swagger.js`,
		`${__dirname}/swagger.ts`,
	],
});

export default swaggerSpec;
