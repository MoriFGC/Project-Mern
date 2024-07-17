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
import session from "express-session";
import passport from "./config/passportConfig.js";

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

// Configurazione della sessione
app.use(
  session({
    // Il 'secret' è usato per firmare il cookie di sessione
    // È importante che sia una stringa lunga, unica e segreta
    secret: process.env.SESSION_SECRET,

    // 'resave: false' dice al gestore delle sessioni di non
    // salvare la sessione se non è stata modificata
    resave: false,

    // 'saveUninitialized: false' dice al gestore delle sessioni di non
    // creare una sessione finché non memorizziamo qualcosa
    // Aiuta a implementare le "login sessions" e riduce l'uso del server di memorizzazione
    saveUninitialized: false,
  })
);




mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connesso'))
    .catch((err) => console.error('Errore di connessione', err));

// Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());
//-----------------------------------------------
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

