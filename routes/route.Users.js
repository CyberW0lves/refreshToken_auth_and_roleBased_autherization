import { Router } from "express";
import Bcrypt from "bcrypt";

import Auth from "../middleware/middle.Auth.js";
import User from "../models/model.User.js";
import UserToken from "../models/model.UserToken.js";
import { 
	refreshTokenBodyValidation, 
	changePasswordValidation 
} from "../utilities/utilities.ValidationSchema.js";

const router = Router();

router.get("/welcome", Auth, async (req, res) => {
	try {
		const userID = req.user;
		const user = await User.findOne({ _id: userID._id });
		if (!user) {
			return res.status(400).json({ status: false, message: "User name is not exist" });
		}

		res.status(200).json({ status: true, message: `Walcome ${user.user_name}. 🙏🙏🙏❤️❤️❤️` });
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: false, message: "💥💥 Internal Server Error 💥💥" });
	}
});

// change password
router.post("/changepassword", Auth, async (req, res) => {
	try {
		// Validate Body Data
		const { error } = changePasswordValidation(req.body);
		if (error) {
			return res.status(400).json({ status: false, message: error.details[0].message });
		}

		// Check user exist
		const userID = req.user;
		const user = await User.findOne({ _id: userID._id });
		if (!user) {
			return res.status(400).json({ status: false, message: "User name is not exist" });
		}

		// Validate password
		const verifiedPassword = await Bcrypt.compare(req.body.old_password,user.password);
		if (!verifiedPassword) {
			return res.status(401).json({ status: false, message: "Old password incorected." });
		}

		// New password compare
		const verifiedNewPassword = (req.body.new_password == req.body.confirm_password);
		if (!verifiedNewPassword) {
			return res.status(401).json({ status: false, message: "New password not matched." });
		}

		// Encrypt new password
		const salt = await Bcrypt.genSalt(Number(10));
		const hashNewPassword = await Bcrypt.hash(req.body.new_password, salt);

		// Set value for update
		const user_id = {_id: userID._id};
		const newVal = {$set: {password: hashNewPassword}};

		// Execute update password
		await User.updateOne(user_id,newVal);

		// Return Data Successfully
		res.status(201).json({ 
			status: true, 
			message: "Account change password sucessfully",
			data: {
				user_id: user._id,
				user_name: user.user_name,
				new_password: req.body.new_password,
				phone_no: user.phone_no,
				user_role: user.roles
			}
		});

	} catch (err) {
		console.log(err);
		res.status(500).json({ status: false, message: "💥💥 Internal Server Error 💥💥" });
	}
});


// logout
router.get("/logout", Auth, async (req, res) => {
	try {

		// Get Refresh Token Prepare To Validation
		const strRefreshToken = {"refreshToken": req.cookies['x-refresh-token']};
 		const { error } = refreshTokenBodyValidation(strRefreshToken);
		if (error) {
			return res.status(400).json({ status: false, message: error.details[0].message });
		}

		// Check Token Exist on Database
		const userToken = await UserToken.findOne({ token: req.cookies['x-refresh-token'] });
		if (!userToken){
			return res.status(400).json({ status: false, message: "Access Denied: Invalid token" });
		}

		// Remove Request Tokens
		res.clearCookie("x-access-token");
		res.clearCookie("x-refresh-token");

		// Remove Refress Token at Database
		await userToken.remove();
		res.status(200).json({ status: true, message: "Logged Out Sucessfully 🙏🙏🙏❤️❤️❤️" });

	} catch (err) {
		console.log(err);
		res.status(500).json({ status: false, message: "💥💥 Internal Server Error 💥💥" });
	}
});

export default router;
