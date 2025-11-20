import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}))


app.use(express.json());
app.use(cookieParser());


app.use('/api/auth' , authRoutes);
app.use('/api/boards' , boardRoutes);


app.listen(process.env.PORT , () => {
    console.log(`Server running on port ${process.env.PORT}`);  
    connectDB();
})