import express from "express";
import Authors from "../models/Authors.js";
import { generateJWT } from "../utils/Jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

// Ottieni l'URL del frontend dalle variabili d'ambiente
const FRONTEND_URL = process.env.FRONTEND_URL;

// Log per verificare l'URL del frontend
console.log("Frontend URL:", FRONTEND_URL);

// Rotta per iniziare l'autenticazione Google
router.get(
  "/google",
  (req, res, next) => {
    console.log("Iniziando l'autenticazione Google");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Rotta di callback per l'autenticazione Google
router.get("/api/auth/google/callback", 
  (req, res, next) => {
    console.log("Ricevuta callback da Google");
    next();
  },
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
  async (req, res) => {
    try {
      console.log("Autenticazione Google riuscita, generando token");
      const token = await generateJWT({ id: req.user._id });
      const userData = {
        email: req.user.email,
        nome: req.user.nome,
        cognome: req.user.cognome,
      };
      const redirectURL = `${FRONTEND_URL}/login?token=${token}&userData=${encodeURIComponent(JSON.stringify(userData))}`;
      console.log("Reindirizzamento a:", redirectURL);
      res.redirect(redirectURL);
    } catch (error) {
      console.error("Errore nella generazione del token:", error);
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// Rotta per il login tradizionale
router.post("/login", async (req, res) => {
  console.log("Ricevuta richiesta di login:", req.body);
  try {
    const { email, password } = req.body;
    console.log("Tentativo di login per email:", email);
    
    const author = await Authors.findOne({ email });
    if (!author) {
      console.log("Autore non trovato per email:", email);
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      console.log("Password non corrispondente per email:", email);
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const token = await generateJWT({ id: author._id });
    console.log("Login effettuato con successo per email:", email);
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore del server" });
  }
});

// Rotta per ottenere i dati dell'utente autenticato
router.get("/me", authMiddleware, (req, res) => {
  if (!req.author) {
    return res.status(401).json({ message: "Utente non autenticato" });
  }
  const authorData = req.author.toObject();
  delete authorData.password;
  res.json(authorData);
});

// Rotta per iniziare l'autenticazione GitHub
router.get(
  "/github",
  (req, res, next) => {
    console.log("Iniziando l'autenticazione GitHub");
    next();
  },
  passport.authenticate("github", { scope: ["user:email"] })
);

// Rotta di callback per l'autenticazione GitHub
router.get(
  "/github/callback",
  (req, res, next) => {
    console.log("Ricevuta callback da GitHub");
    next();
  },
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login` }),
  async (req, res) => {
    try {
      console.log("Autenticazione GitHub riuscita, generando token");
      const token = await generateJWT({ id: req.user._id });
      const userData = {
        email: req.user.email,
        nome: req.user.nome,
        cognome: req.user.cognome,
      };
      const redirectURL = `${FRONTEND_URL}/login?token=${token}&userData=${encodeURIComponent(JSON.stringify(userData))}`;
      console.log("Reindirizzamento a:", redirectURL);
      res.redirect(redirectURL);
    } catch (error) {
      console.error("Errore nella generazione del token:", error);
      res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);



export default router;