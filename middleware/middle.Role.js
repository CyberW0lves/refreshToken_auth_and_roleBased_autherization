const roleCheck = (roles) => {
	return (req, res, next) => {
		roles.push("user");
		if (req.user.roles.includes(...roles)) {
			next();
		} else {
			res.status(403).json({ status: false, message: "You are not authorized" });
		}
	};
};

export default roleCheck;
