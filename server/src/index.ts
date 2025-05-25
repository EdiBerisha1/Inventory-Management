import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

// ROUTES

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users", userRoutes); // http://localhost:8000/users

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
