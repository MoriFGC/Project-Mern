import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import endpoints from 'express-list-endpoints';
import cors from 'cors';
import blogPostRoutes from './routes/blogPostRoutes.js'
import authorRoutes from './routes/authorsRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js"; // Rotte per l'autenticazione

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler
} from './middlewares/errorHandlers.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connesso'))
    .catch((err) => console.error('Errore di connessione', err));


app.use("/api/auth", authRoutes); // Rotte per l'autenticazione
app.use('/api/authors', authorRoutes);
app.use('/api/blogPosts', blogPostRoutes);

const PORT = process.env.PORT || 5000;

app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(PORT, () => {
    console.log('Server connesso sulla porta ' + PORT);
    console.table(
        endpoints(app).map((route) => ({
          path: route.path,
          methods: route.methods.join(", "),
        })),
      );
});

