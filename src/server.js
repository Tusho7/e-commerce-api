import express from "express";
import cors from "cors";
import prisma from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import topModelsRoutes from "./routes/topModelsRoutes.js";
import aboutUsRoutes from "./routes/aboutUsRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import privacyPolicyRoutes from "./routes/privacyPolicyRoutes.js";
import termsAndConditionsRoutes from "./routes/termsAndConditionsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
configDotenv();

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/auth", userRoutes);
app.use("/", categoryRoutes);
app.use("/", productRoutes);
app.use("/", wishlistRoutes);
app.use("/", cartRoutes);
app.use("/", faqRoutes);
app.use("/", contactRoutes);
app.use("/", testimonialRoutes);
app.use("/", topModelsRoutes);
app.use("/", aboutUsRoutes);
app.use("/", careerRoutes);
app.use("/", privacyPolicyRoutes);
app.use("/", termsAndConditionsRoutes);
app.use("/", adminRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}

startServer();
