const roleCheck = (roles) => {
	return (req, res, next) => {
		roles.push("user");
		if (req.user.roles.includes(...roles)) {
			next();
		} else {
			res.status(403).json({ error: true, message: "You are not authorized" });
		}
	};
};

export default roleCheck;
