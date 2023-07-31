import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
	category_group: { type: String, required: true, unique: true },
	category_name: { type: Array, required: true, default: [] },
    createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model("CategoryName", categorySchema);

export default Category;