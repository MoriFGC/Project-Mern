// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import endpoints from 'express-list-endpoints';
// import cors from 'cors';
// import blogPostRoutes from './routes/blogPostRoutes.js'
// import authorRoutes from './routes/authorRoutes.js'
// import authRoutes from "./routes/authRoutes.js";
// import session from "express-session";
// import passport from "./config/passportConfig.js";
// import path from 'path';
// import { fileURLToPath } from 'url';

// import {
//     badRequestHandler,
//     unauthorizedHandler,
//     notFoundHandler,
//     genericErrorHandler
// } from './middlewares/errorHandlers.js'

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// const corsOptions = {
//   origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'https://project-mern-nine.vercel.app'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));

// // Aggiungi questo middleware prima delle tue rotte
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// });

// app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === 'production' }
//   })
// );

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connesso'))
//     .catch((err) => console.error('Errore di connessione', err));

// app.use(passport.initialize());
// app.use(passport.session());

// app.use("/api/auth", authRoutes);
// app.use('/api/authors', authorRoutes);
// app.use('/api/blogPosts', blogPostRoutes);

// app.get('/api/test', (req, res) => {
//   res.json({ message: 'Server is working correctly' });
// });

// app.use(badRequestHandler);
// app.use(unauthorizedHandler);
// app.use(notFoundHandler);
// app.use(genericErrorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server connesso sulla porta ${PORT}`);
//     console.log('Environment:', process.env.NODE_ENV);
//     console.table(
//         endpoints(app).map((route) => ({
//           path: route.path,
//           methods: route.methods.join(", "),
//         }))
//     );
// });


// Importazione dei moduli necessari
import express from "express"; // Framework web per Node.js
import mongoose from "mongoose"; // ODM per MongoDB
import dotenv from "dotenv"; // Per caricare variabili d'ambiente da file .env
import cors from "cors"; // Middleware per gestire CORS (Cross-Origin Resource Sharing)
import listEndpoints from "express-list-endpoints"; // Utility per elencare gli endpoints dell'app
import authorRoutes from "./routes/authorRoutes.js"; // Rotte per gli autori
import blogPostRoutes from "./routes/blogPostRoutes.js"; // Rotte per i blog post
import authRoutes from "./routes/authRoutes.js"; // Rotte per l'autenticazione
import session from "express-session"; // Importiamo session
import passport from "./config/passportConfig.js"; // importiamo passport

// MIDDLEWARE Importazione dei middleware per la gestione degli errori
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./middlewares/errorHandlers.js";

// Carica le variabili d'ambiente dal file .env
dotenv.config();

// Creazione dell'istanza dell'applicazione Express
const app = express();

// NEW! Configurazione CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Definiamo una whitelist di origini consentite. 
    // Queste sono gli URL da cui il nostro frontend farà richieste al backend.
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      'https://mern-blog-part-v.vercel.app', // Frontend in produzione (prendere da vercel!)
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

// Applicazione dei middleware globali
app.use(cors(corsOptions)); // NEW! Abilita CORS per tutte le rotte
app.use(express.json()); // Parsing del corpo delle richieste in formato JSON

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

// Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());

// Connessione al database MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connesso"))
  .catch((err) => console.error("Errore di connessione MongoDB:", err));

// Definizione delle rotte principali
app.use("/api/auth", authRoutes); // Rotte per l'autenticazione
app.use("/api/authors", authorRoutes); // Rotte per gli autori
app.use("/api/blogPosts", blogPostRoutes); // Rotte per i blog post

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 3000;

// Applicazione dei middleware per la gestione degli errori
app.use(badRequestHandler); // Gestisce errori 400 Bad Request
app.use(unauthorizedHandler); // Gestisce errori 401 Unauthorized
app.use(notFoundHandler); // Gestisce errori 404 Not Found
app.use(genericErrorHandler); // Gestisce tutti gli altri errori

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);

  // Stampa tutte le rotte disponibili in formato tabellare
  console.log("Rotte disponibili:");
  console.table(
    listEndpoints(app).map((route) => ({
      path: route.path,
      methods: route.methods.join(", "),
    }))
  );
});