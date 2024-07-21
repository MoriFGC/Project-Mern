import express from "express";
import Authors from "../models/Authors.js";
import { generateJWT } from "../utils/Jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js"; //  Importiamo passport

const router = express.Router();

// Definisci l'URL del frontend usando una variabile d'ambiente
const FRONTEND_URL = process.env.FRONTEND_URL;

// Rotta per iniziare il processo di autenticazione Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// Questo endpoint inizia il flusso di autenticazione OAuth con Google
// 'google' si riferisce alla strategia GoogleStrategy configurata in passportConfig.js
// scope: specifica le informazioni richiediamo a Google (profilo e email)

// Rotta di callback per l'autenticazione Google
router.get(
  "/google/callback",
  // Passport tenta di autenticare l'utente con le credenziali Google
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  // Se l'autenticazione fallisce, l'utente viene reindirizzato alla pagina di login

  async (req, res) => {
    try {
      // A questo punto, l'utente è autenticato con successo
      // req.user contiene i dati dell'utente forniti da Passport

      // Genera un JWT (JSON Web Token) per l'utente autenticato
      // Usiamo l'ID dell'utente dal database come payload del token
      const token = await generateJWT({ id: req.user._id });

      // Reindirizza l'utente al frontend, passando il token come parametro URL
      // Il frontend può quindi salvare questo token e usarlo per le richieste autenticate
      const userData = {
        email: req.user.email,
        nome: req.user.nome,
        cognome: req.user.cognome,
      };
      res.redirect(
        `${FRONTEND_URL}/login?token=${token}&userData=${encodeURIComponent(
          JSON.stringify(userData)
        )}`
      );
    } catch (error) {
      // Se c'è un errore nella generazione del token, lo logghiamo
      console.error("Errore nella generazione del token:", error);
      // E reindirizziamo l'utente alla pagina di login con un messaggio di errore
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// POST /login => restituisce token di accesso
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);
    
    const author = await Authors.findOne({ email });
    if (!author) {
      console.log("Author not found for email:", email);
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const token = await generateJWT({ id: author._id });
    console.log("Login successful for email:", email);
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore del server" });
  }
});

// GET /me => restituisce l'autore collegato al token di accesso
// authMiddleware verifica il token e aggiunge i dati dell'autore a req.author
router.get("/me", authMiddleware, (req, res) => {
  if (!req.author) {
    return res.status(401).json({ message: "Utente non autenticato" });
  }
  const authorData = req.author.toObject();
  delete authorData.password;
  res.json(authorData);
});

router.get(
  "/github/callback",
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login` }),
  async (req, res) => {
    try {
      const token = await generateJWT({ id: req.user._id });
      const userData = {
        email: req.user.email,
        nome: req.user.nome,
        cognome: req.user.cognome,
      };
      res.redirect(
        `${FRONTEND_URL}/login?token=${token}&userData=${encodeURIComponent(
          JSON.stringify(userData)
        )}`
      );
    } catch (error) {
      console.error("Errore nella generazione del token:", error);
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// Rotta di callback per l'autenticazione GitHub
// router.get('/github/callback',
//   passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login` }),
//   handleAuthCallback
// );

// // Funzione helper per gestire il callback di autenticazione
// async function handleAuthCallback(req, res) {
//   try {
//     const token = await generateJWT({ id: req.user._id });
//     // Usa FRONTEND_URL per il reindirizzamento
//     res.redirect(`${FRONTEND_URL}/login?token=${token}`);
//   } catch (error) {
//     console.error('Errore nella generazione del token:', error);
//     res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
//   }
// }

export default router;
