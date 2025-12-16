import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import jobRoutes from "./src/routes/job.routes.js";
dotenv.config(); 

const app = express();
connectDB();

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);



app.get("/", (req, res) => {
  res.send("Backend server is running...");
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
