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
 *         courses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID of the course the user is enrolled in
 *           description: List of courses the user is enrolled in
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
 *         password: hashedpassword123!
 *     Review:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           description: Information about the user who left the review
 *         rating:
 *           type: number
 *           description: Rating given by the user
 *           default: 0
 *         comment:
 *           type: string
 *           description: Review comment
 *         commentReplies:
 *           type: array
 *           items:
 *             type: object
 *           description: Replies to the review comment
 *       example:
 *         user: { id: "userId123", name: "John Doe" }
 *         rating: 4.5
 *         comment: "Great course!"
 *         commentReplies: []
 *
 *     Link:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the link
 *         url:
 *           type: string
 *           description: URL of the link
 *       example:
 *         title: "Course Resources"
 *         url: "https://example.com/resources"
 *
 *     Comment:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           description: Information about the user who left the comment
 *         question:
 *           type: string
 *           description: Question or comment from the user
 *         questionReplies:
 *           type: array
 *           items:
 *             type: object
 *           description: Replies to the question or comment
 *       example:
 *         user: { id: "userId123", name: "John Doe" }
 *         question: "What is the duration of the course?"
 *         questionReplies: []
 *
 *     CourseData:
 *       type: object
 *       properties:
 *         videoUrl:
 *           type: string
 *           description: URL of the video
 *         title:
 *           type: string
 *           description: Title of the course section
 *         videoSection:
 *           type: string
 *           description: Section of the video
 *         description:
 *           type: string
 *           description: Description of the course section
 *         videoLength:
 *           type: number
 *           description: Length of the video in minutes
 *         videoPlayer:
 *           type: string
 *           description: The video player used
 *         links:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Link'
 *           description: Links related to the course section
 *         suggestion:
 *           type: string
 *           description: Suggestion for further learning
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Questions related to the course section
 *       example:
 *         videoUrl: "https://example.com/video.mp4"
 *         title: "Introduction to JavaScript"
 *         videoSection: "Section 1"
 *         description: "This section introduces JavaScript basics."
 *         videoLength: 45
 *         videoPlayer: "YouTube"
 *         links: [{ title: "Documentation", url: "https://example.com/docs" }]
 *         suggestion: "Learn more about JavaScript ES6 features."
 *         questions: []
 *
 *     Course:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - categories
 *         - price
 *         - tags
 *         - level
 *         - demoUrl
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the course
 *         description:
 *           type: string
 *           description: Description of the course
 *         categories:
 *           type: string
 *           description: Categories the course falls under
 *         price:
 *           type: number
 *           description: Price of the course
 *         estimatedPrice:
 *           type: number
 *           description: Estimated price of the course
 *         thumbnail:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               description: Public ID of the course thumbnail
 *             url:
 *               type: string
 *               description: URL of the course thumbnail
 *         tags:
 *           type: string
 *           description: Tags related to the course
 *         level:
 *           type: string
 *           description: Level of the course (e.g., Beginner, Intermediate, Advanced)
 *         demoUrl:
 *           type: string
 *           description: URL for the course demo
 *         benefits:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *           description: Benefits of the course
 *         prerequisites:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *           description: Prerequisites of the course
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *           description: Reviews for the course
 *         courseData:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseData'
 *           description: Sections of the course
 *         ratings:
 *           type: number
 *           description: Average rating of the course
 *           default: 0
 *         purchased:
 *           type: number
 *           description: Number of times the course has been purchased
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the course was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the course was last updated
 *       example:
 *         name: "JavaScript Essentials"
 *         description: "Learn JavaScript from scratch"
 *         categories: "Programming, Web Development"
 *         price: 49.99
 *         estimatedPrice: 45.00
 *         thumbnail: { public_id: "thumbnail123", url: "https://example.com/thumbnail.jpg" }
 *         tags: "JavaScript, Programming"
 *         level: "Beginner"
 *         demoUrl: "https://example.com/demo"
 *         benefits: [{ title: "Master JavaScript basics" }]
 *         prerequisites: [{ title: "Basic computer skills" }]
 *         reviews: []
 *         courseData: []
 *         ratings: 4.8
 *         purchased: 1200
 *         createdAt: "2023-09-07T12:34:56.000Z"
 *         updatedAt: "2023-09-07T12:34:56.000Z"
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
