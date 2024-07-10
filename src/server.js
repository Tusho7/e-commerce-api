import express from 'express';
import prisma from './config/database.js'; 
import userRoutes from './routes/userRoutes.js';
import { configDotenv } from 'dotenv';

const app = express();
configDotenv();

app.use(express.json());

app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

startServer();
