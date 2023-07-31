import { Router } from "express";
import JWT from "jsonwebtoken";

import Auth from "../middleware/middle.Auth.js";
import VerifyRefreshToken from "../utilities/utilities.VerifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../utilities/utilities.ValidationSchema.js";

const router = Router();

// Refresh new access token
router.get("/", Auth, async (req, res) => {

	// const { error } = refreshTokenBodyValidation(req.body);

	const strRefreshToken = {"refreshToken": req.cookies['x-refresh-token']};

	const { error } = refreshTokenBodyValidation(strRefreshToken);
	if (error) {
		return res.status(400).json({ status: false, message: error.details[0].message });
	}

	VerifyRefreshToken(req.cookies['x-refresh-token'])
		.then(({ tokenDetails }) => {
			const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
			const accessToken = JWT.sign(
				payload,
				process.env.ACCESS_TOKEN_PRIVATE_KEY,{ 
					expiresIn: "15m" 
				}
			);
			res.cookie(`x-access-token`,accessToken,{
				expiresIn: "15m"
			});

			res.status(200).json({
				status: true,
				accessToken,
				message: "Access token created successfully",
			});
		})
		.catch((err) => res.status(400).json(err));
});

export default router;
