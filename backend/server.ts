import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/UserRoutes"; 
import productRoutes from "./routes/ProductRoutes"; 
import cartRoutes from "./routes/CartRoutes"; 
import checkoutRoutes from "./routes/CheckoutRoutes"; 
import orderRoutes from "./routes/OrderRoutes"; 
import uploadRoutes from "./routes/UploadRoutes"; 
import subscribeRoute from "./routes/subscribeRoute"; 
import adminRoutes from "./routes/adminRoutes"; 
import productAdminRoutes from "./routes/ProductAdminRoutes"; 
import adminOrderRoutes from "./routes/adminOrderRoutes"; 


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT: number | string = process.env.PORT || 3000;

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("WELCOME TO BAGVIBE API");
});

app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoute);

app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
