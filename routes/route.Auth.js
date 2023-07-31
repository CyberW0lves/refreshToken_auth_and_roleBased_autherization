import { Router } from "express";
import Bcrypt from "bcrypt";

import User from "../models/model.User.js";
import GenerateTokens from "../utilities/utilities.GenerateTokens.js";
import { 
	signUpBodyValidation, 
	logInBodyValidation 
} from "../utilities/utilities.ValidationSchema.js";

const router = Router();

// signup
router.post("/register", async (req, res) => {
	try {
		req.body.phone_no = req.body.user_name;
		const { error } = signUpBodyValidation(req.body);
		if (error) {
			return res.status(400).json({ status: false, message: error.details[0].message });
		}

		const user = await User.findOne({ user_name: req.body.user_name });
		if (user) {
			return res.status(400).json({ status: false, message: "User with given user name already exist" });
		}

		const salt = await Bcrypt.genSalt(Number(10));
		const hashPassword = await Bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();

		const userData = await User.findOne({ user_name: req.body.user_name });

		res.status(201).json({ 
			status: true, 
			message: "Account created sucessfully",
			data: {
				user_id: userData._id,
				user_name: userData.user_name,
				password: req.body.password,
				phone_no: userData.phone_no,
				user_role: userData.roles
			}
		});

	} catch (err) {
		console.log(err);
		res.status(500).json({ status: false, message: "Internal Server Error" });
	}
});

// login
router.post("/login", async (req, res) => {
	try {
		const { error } = logInBodyValidation(req.body);
		if (error) {
			return res.status(400).json({ status: false, message: error.details[0].message });
		}

		const user = await User.findOne({ user_name: req.body.user_name });
		if (!user){
			return res.status(401).json({ status: false, message: "Invalid user name or password" });
		}

		const verifiedPassword = await Bcrypt.compare(req.body.password,user.password);
		if (!verifiedPassword) {
			return res.status(401).json({ status: false, message: "Invalid user name or password" });
		}

		const { accessToken, refreshToken } = await GenerateTokens(user);

		 // res.cookie("x-access-token", token);
		 res.cookie(`x-access-token`,accessToken,{
            expiresIn: "15m",
            secure: true,
            httpOnly: true
        });
		res.cookie(`x-refresh-token`,refreshToken,{
            expiresIn: "30d",
            secure: true,
            httpOnly: true
        });

		res.status(200).json({
			status: true,
			accessToken,
			refreshToken,
			message: "Logged in sucessfully",
			data: {
				user_id: user._id,
				user_name: user.user_name,
				phone_no: user.phone_no,
				user_role: user.roles
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ status: false, message: "Internal Server Error" });
	}
});

export default router;
