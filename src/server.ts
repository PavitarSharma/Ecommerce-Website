import express, { Application } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { routes } from "./routes";
import { errorHandler } from "./middlewares";
import path from "path";
import { CLIENT_URL } from "./config";

dotenv.config();

const app: Application = express();


app.use(
  cors({
    origin: [CLIENT_URL as string, "*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
if(process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
};
app.set("view engine", "ejs");
// Setting for the root path for views directory
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
 res.status(200).json({
  status: 200,
  message: "Success"
 })
});

app.use("/api", routes);
app.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Not Found",
  });
});

app.use(errorHandler);

export default app;
