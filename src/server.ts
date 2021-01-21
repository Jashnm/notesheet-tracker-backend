import express, { Request, Response } from "express";

import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import deptSchoolRoutes from "./routes/deptSchoolRoutes";
import notesheetRoutes from "./routes/notesheetRoutes";
import adminRoutes from "./routes/adminRoutes";

import { errorHandler, notFound } from "./middleware/errorMiddleware";

const app = express();
dotenv.config();

app.use(express.json());
app.use(morgan("dev"));

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
  })
);

app.get("/", (_: Request, res: Response) => {
  res.json({ cool: "Okay" });
});
////////******** USER-DEPT-SCHOOL ROUTES ********////////

app.use("/api/user", userRoutes);

app.use("/api", deptSchoolRoutes);

////////******** NOTESHEET ROUTES ********////////

app.use("/api/notesheet", notesheetRoutes);

////////******** ADMIN ROUTES ********////////

app.use("/api/admin", adminRoutes);

////////******** Error MiddleWare ********////////

app.use(notFound);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("server at http://localhost:5000");
});
