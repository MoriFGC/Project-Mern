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

// NEW! Configurazione CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Definiamo una whitelist di origini consentite. 
    // Queste sono gli URL da cui il nostro frontend farà richieste al backend.
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      'https://mern-blog-part-v.vercel.app/', // Frontend in produzione (prendere da vercel!)
      'https://mern-blog-ctt3.onrender.com' // URL del backend (prendere da render!)
    ];
    
    if (process.env.NODE_ENV === 'development') {
      // In sviluppo, permettiamo anche richieste senza origine (es. Postman)
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      // In produzione, controlliamo se l'origine è nella whitelist
      callback(null, true);
    } else {
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione
  // basata su sessioni.
};

// NEW! passiamo `corsOptions` a cors()
app.use(cors(corsOptions));

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

