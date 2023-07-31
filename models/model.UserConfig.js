import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userConfigSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
	user_name: { type: String, required: true },
	config_name: { type: String, required: true },
	photo_link: { type: String, required: true },
	font_name: { type: String, required: true },
	user_config: { type: Array, required: true, default: [] },
	user_selected: { type: String, enum: ["0", "1"], default: "0" },
    createdAt: { type: Date, default: Date.now }
});


const UserConfig = mongoose.model("UserConfig", userConfigSchema);

export default UserConfig;
