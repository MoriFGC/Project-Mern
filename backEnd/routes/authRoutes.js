import express from "express";
import Authors from "../models/Authors.js";
import { generateJWT } from "../utils/Jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL;

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }),
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

router.get("/me", authMiddleware, (req, res) => {
  if (!req.author) {
    return res.status(401).json({ message: "Utente non autenticato" });
  }
  const authorData = req.author.toObject();
  delete authorData.password;
  res.json(authorData);
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

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

export default router;