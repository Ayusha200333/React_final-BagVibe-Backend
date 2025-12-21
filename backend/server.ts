import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/UserRoutes"; // TypeScript import

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const PORT: number | string = process.env.PORT || 3000;

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("WELCOME TO BAGVIBE API");
});

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
