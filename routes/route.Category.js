import { Router } from "express";

import Auth from "../middleware/middle.Auth.js";
import Category from "../models/model.Category.js";
import { categoryValidation } from "../utilities/utilities.ValidationSchema.js";

const router = Router();

router.post("/", Auth, async (req, res) => {

    try {
        // Validate Body
        const { error } = categoryValidation(req.body);
        if (error) {
            return res.status(400).json({ status: false, message: error.details[0].message });
        }

        await new Category({ ...req.body}).save();
        res.status(200).json({ status: true, message: "Save Category Successfully." });

    } catch (err) {
        console.log(err);
		res.status(500).json({ status: false, message: "💥💥 Internal Server Error 💥💥" });
    }
});

export default router;
