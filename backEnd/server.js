import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import endpoints from 'express-list-endpoints';
import cors from 'cors';
import blogPostRoutes from './routes/blogPostRoutes.js'
import authorRoutes from './routes/authorRoutes.js'
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import passport from "./config/passportConfig.js";
import path from 'path';
import { fileURLToPath } from 'url';

import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler
} from './middlewares/errorHandlers.js'

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'https://project-mern-nine.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Aggiungi questo middleware prima delle tue rotte
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connesso'))
    .catch((err) => console.error('Errore di connessione', err));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/blogPosts', blogPostRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working correctly' });
});

app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server connesso sulla porta ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.table(
        endpoints(app).map((route) => ({
          path: route.path,
          methods: route.methods.join(", "),
        }))
    );
});