import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

import ConectDB from "./configs/configs.ConnectDB.js";
import AuthRoutes from "./routes/route.Auth.js";
import RefreshTokenRoutes from "./routes/route.RefreshToken.js";
import UserRoutes from "./routes/route.Users.js";
import UserConfigRoutes from "./routes/route.UserConfig.js";
import CategoryRoutes from "./routes/route.Category.js";

const app = express();

config();
ConectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api", AuthRoutes);
app.use("/api/refresh", RefreshTokenRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/config", UserConfigRoutes);
app.use("/api/category", CategoryRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
