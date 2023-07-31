import { Router } from "express";

import Auth from "../middleware/middle.Auth.js";
import User from "../models/model.User.js";
import UserConfig from "../models/model.UserConfig.js";
import { 
    userConfigValidation,
    userConfigSaveValidation
} from "../utilities/utilities.ValidationSchema.js";

const router = Router();

router.get("/load", Auth, async (req, res) => {

    try {
        // Get User Info
        const userID = req.user;
        const userDataConfig = await UserConfig.findOne({ user_id: userID._id });
        
        // Reponse Data
        res.status(200).json({ status: true, data: userDataConfig });

    } catch (err) {
        console.log(err);
		res.status(500).json({ status: false, message: "💥💥 Internal Server Error 💥💥" });
    }
});

router.post("/save", Auth, async (req, res) => {
	try{

        // Body Config Validation
        const { error } = userConfigValidation(req.body);
		if (error) {
			return res.status(400).json({ status: false, message: error.details[0].message });
		}

        // Get User Info
        const userID = req.user;
        const userData = await User.findOne({ _id: userID._id });

        // Add Data To Body
        req.body.user_id = userData._id;
        req.body.user_name = userData.user_name;

        // Body Config Save Validation
        const { configerr } = userConfigSaveValidation(req.body);
		if (configerr) {
			return res.status(400).json({ status: false, message: configerr.details[0].message });
		}

        // Check Config Exist
        const configData = await UserConfig.findOne({ user_id: userID._id });

        // If validate config
        if (!configData) {
            // Save New Data User Config
            await new UserConfig({ ...req.body}).save();
        } else {
            // Remove Old Config
            await UserConfig.remove();
            // Save Data User Config
            await new UserConfig({ ...req.body}).save();
        }

        res.status(200).json({ status: true , data: req.body });

    }catch (err) {
        console.log(err);
		res.status(500).json({ status: false, message: "💥💥 Internal Server Error 💥💥" });
    }
});

export default router;
