import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://ekosight-task-xwd2.vercel.app',
        'https://ekosight-task-3.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

const __dirname = path.resolve();






app.use(express.json());
app.use(cookieParser());


app.use('/api/auth' , authRoutes);
app.use('/api/boards' , boardRoutes);


if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get(/^(?!\/api).*/, (req , res) => {
        res.sendFile(path.join(__dirname, "../frontend" , "dist" , "index.html"));
    });
}


app.listen(process.env.PORT , () => {
    console.log(`Server running on port ${process.env.PORT}`);  
    connectDB();
})