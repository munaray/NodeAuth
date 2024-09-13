import "dotenv/config";
import ejs from "ejs";
import path from "path";
import { EmailOptions } from "../utils/types";
import nodemailer, { Transporter } from "nodemailer";

const mailSender = async (options: EmailOptions): Promise<void> => {
	const transporter: Transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT || "587"),
		service: process.env.SMTP_SERVICES,
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	const { data, email, subject, template } = options;

	// get the path to the email template file
	const templatePath = path.join(__dirname, "../mails", template);

	// render the email template with ejs
	const html = await ejs.renderFile(templatePath, data);

	const mailOptions = {
		from: process.env.SMTP_MAIL,
		to: email,
		subject,
		html,
	};

	await transporter.sendMail(mailOptions);
};

export default mailSender;
