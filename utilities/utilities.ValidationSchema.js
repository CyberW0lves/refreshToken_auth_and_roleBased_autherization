import Joi from "joi";

import JoiPasswordComplexity from "joi-password-complexity";

const signUpBodyValidation = (body) => {
	const schema = Joi.object({
		user_name: Joi.string().required().label("User Name"),
		phone_no: Joi.string().required().label("Phone Number"),
		password: JoiPasswordComplexity().required().label("Password"),
	});
	return schema.validate(body);
};

const logInBodyValidation = (body) => {
	const schema = Joi.object({
		user_name: Joi.string().required().label("User Name"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(body);
};

const changePasswordValidation = (body) => {
	const schema = Joi.object({
		old_password: Joi.string().required().label("Password"),
		new_password: JoiPasswordComplexity().required().label("New Password"),
		confirm_password: JoiPasswordComplexity().required().label("Confirm Password"),
	});
	return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
	const schema = Joi.object({
		refreshToken: Joi.string().required().label("Refresh Token"),
	});
	return schema.validate(body);
};

const userConfigValidation = (body) => {
	const schema = Joi.object({
		config_name: Joi.string().required().label("Config Name"),
		photo_link: Joi.string().required().label("Photo Link"),
		font_name: Joi.string().required().label("Font Name"),
		user_config: Joi.array().required().label("User Config"),
	});
	return schema.validate(body);
};

const userConfigSaveValidation = (body) => {
	const schema = Joi.object({
		user_id: Joi.string().required().label("User ID"),
		user_name: Joi.string().required().label("User Name"),
		config_name: Joi.string().required().label("Config Name"),
		photo_link: Joi.string().required().label("Photo Link"),
		font_name: Joi.string().required().label("Font Name"),
		user_config: Joi.array().required().label("User Config"),
	});
	return schema.validate(body);
};

const userConfigSelectUpdate = (body) => {
	const schema = Joi.object({
		user_selected: Joi.string().required().label("Select"),
	});
	return schema.validate(body);
};

const categoryValidation = (body) => {
	const schema = Joi.object({
		category_group: Joi.string().required().label("Category Group"),
		category_name: Joi.array().required().label("Category Name"),
	});
	return schema.validate(body);
};

export {
	signUpBodyValidation,
	logInBodyValidation,
	changePasswordValidation,
	refreshTokenBodyValidation,
	userConfigValidation,
	userConfigSaveValidation,
	userConfigSelectUpdate,
	categoryValidation,
};
