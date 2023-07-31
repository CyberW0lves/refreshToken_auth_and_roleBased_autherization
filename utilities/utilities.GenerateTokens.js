import JWT from "jsonwebtoken";

import UserToken from "../models/model.UserToken.js";

const GenerateTokens = async (user) => {
	try {
		const payload = { _id: user._id, roles: user.roles };
		const accessToken = JWT.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{ expiresIn: "15m" }
		);
		const refreshToken = JWT.sign(
			payload,
			process.env.REFRESH_TOKEN_PRIVATE_KEY,
			{ expiresIn: "30d" }
		);

		const userToken = await UserToken.findOne({ userId: user._id });
		if (userToken) await userToken.remove();

		await new UserToken({ userId: user._id, token: refreshToken }).save();
		return Promise.resolve({ accessToken, refreshToken });
	} catch (err) {
		return Promise.reject(err);
	}
};

export default GenerateTokens;
