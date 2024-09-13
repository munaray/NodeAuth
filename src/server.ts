import { app } from "./app";
import "dotenv/config";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";

// cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const PORT = process.env.PORT || 3001;
// create server
app.listen(PORT, () => {
	console.log(`Server is connected at port ${PORT}`);
	connectDB();
});
