import JWT from "jsonwebtoken";

import UserToken from "../models/model.UserToken.js";

const VerifyRefreshToken = (refreshToken) => {
	const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

	return new Promise((resolve, reject) => {
		UserToken.findOne({ token: refreshToken }, (err, doc) => {
			if (!doc) {
				return reject({ status: false, message: "Invalid refresh token" });
			}

			JWT.verify(refreshToken, privateKey, (err, tokenDetails) => {
				if (err) {
					return reject({ status: false, message: "Invalid refresh token" });
				}

				resolve({
					tokenDetails,
					status: true,
					message: "Valid refresh token",
				});
			});
		});
	});
};

export default VerifyRefreshToken;
