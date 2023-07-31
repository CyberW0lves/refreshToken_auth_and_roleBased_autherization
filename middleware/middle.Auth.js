import JWT from "jsonwebtoken";

const Auth = async (req, res, next) => {
	//const token = req.header("x-access-token");

	const token = req.cookies['x-access-token'];

	if (!token) {
		return res.status(403).json({ status: false, message: "Access Denied: No token provided" });		
	}

	try {
		const tokenDetails = JWT.verify(token,process.env.ACCESS_TOKEN_PRIVATE_KEY);
		req.user = tokenDetails;
		next();
	} catch (err) {
		console.log(err);
		res.status(403).json({ status: false, message: "Access Denied: Invalid token" });
	}
};

export default Auth;
