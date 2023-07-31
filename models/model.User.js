import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
	user_name: { type: String, required: true, unique: true },
	phone_no: { type: String, required: true },
	password: { type: String, required: true },
	roles: { type: [String], enum: ["user", "admin", "super_admin"], default: ["user"] }
});

const User = mongoose.model("User", userSchema);

export default User;
