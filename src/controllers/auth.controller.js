import User from "../models/user.model.js";
import JobSeeker from "../models/jobSeeker.model.js";
import Employer from "../models/employer.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { USER_ENUMS } from '../enums/user.enums.js'
import { sendEmail } from "../utils/sendEmail.js";


const registerUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		if (!name || !email || !password || !role) {
			return res.status(400).json({ message: "All fields are required" })
		}

		const emailExists = await User.findOne({ email });
		if (emailExists) {
			return res.status(400).json({ message: "Email already exists" })
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters long" })
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			authProvider: "local",
			role,
		});
		if (role === USER_ENUMS.JOB_SEEKER) {
			JobSeeker.create({
				userId: user._id,
				skills: [],
				resumeUrl: null,
			})
		} else if (role === USER_ENUMS.EMPLOYER) {
			Employer.create({
				userId: user._id,
				companyName: "",
				experienceLevel: "Entry",
				aboutCompany: null,
			})
		}

		return res.status(201).json({ message: "User registered successfully", success: true });

	} catch (error) {
		console.error("Error in user registration:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
}


const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		console.log("body:", req.body)
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required" })
		}

		const existingUser = await User.findOne({ email })
		if (!existingUser) {
			return res.status(400).json({ message: "User does not exist" })
		}
		console.log("user:", existingUser)
		const isPasswordCorrect = await existingUser.matchPassword(password)
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid credentials" })
		}

		const token = jwt.sign(
			{ _id: existingUser._id, role: existingUser.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			maxAge: 24 * 60 * 60 * 1000,
			path: "/",
		});

		res.json({
			message: "Login successful",
			user: {
				_id: existingUser._id,
				name: existingUser.name,
				email: existingUser.email,
				role: existingUser.role,
				jobType: existingUser.jobType,
				experienceLevel: existingUser.experienceLevel,
			},
			success: true
		})


	} catch (error) {
		console.error("Error in user login:", error);
		return res.status(500).json({ message: "Internal Server Error" })
	}
}

const getMe = async (req, res) => {

	try {
		const user = await User.findById(req.user._id).select(
			"-password"
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (err) {
		res.status(500).json({ message: "Failed to fetch user" });
	}
}

const resetPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required" })
		}
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(404).json({ message: "User not found" })
		}

		const token = crypto.randomBytes(32).toString("hex");

		user.resetPasswordToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

		await user.save();

		const resetUrl = `http://localhost:3000/resetPassword/${token}`;

		await sendEmail({
			to: user.email,
			subject: "Password Reset Request",
			text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
		})
		return res.status(200).json({ message: "Password reset email sent", success: true })
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" })
	}
}

const newPassword = async (req, res) => {
	try {
		const resetToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");

		const user = await User.findOne({
			resetPasswordToken: resetToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ message: "Invalid token" });
		}

		user.password = await bcrypt.hash(req.body.password, 10);

		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.json({ success: true });
	} catch (error) {
		return res.status(500).json({ message: "Internal Server Error" })
	}
}

const logoutUser = (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		sameSite: "lax",
		secure: false
	});

	return res.status(200).json({
		message: "Logged out successfully",
		success: true
	});
};

export { registerUser, loginUser, getMe, resetPassword, newPassword, logoutUser };