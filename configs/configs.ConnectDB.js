import mongoose from "mongoose";

const ConectDB = () => {
	const connectionParams = { 
		useNewUrlParser: true,
		dbName: process.env.DB_NAME
	};
	mongoose.set('strictQuery', false);

	mongoose.connect(process.env.DB_URI, connectionParams);

	mongoose.connection.on("connected", () => {
		console.log("Connected to database sucessfully");
	});

	mongoose.connection.on("error", (err) => {
		console.log("Error while connecting to database :" + err);
	});

	mongoose.connection.on("disconnected", () => {
		console.log("Mongodb connection disconnected");
	});
};

export default ConectDB;
