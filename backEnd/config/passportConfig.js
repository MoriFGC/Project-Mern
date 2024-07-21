// Importiamo le dipendenze necessarie
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import Authors from "../models/Authors.js";

// Configuriamo la strategia di autenticazione Google
passport.use(
  new GoogleStrategy(
    {
      // Usiamo le variabili d'ambiente per le credenziali OAuth
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // L'URL a cui Google reindizzerà dopo l'autenticazione
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      scope: ['profile', 'email']  // Assicurati che questo sia presente
    },
    // Questa funzione viene chiamata quando l'autenticazione Google ha successo
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerchiamo se esiste già un autore con questo ID Google
        let author = await Authors.findOne({ googleId: profile.id });

        // Se l'autore non esiste, ne creiamo uno nuovo
        if (!author) {
          author = new Authors({
            googleId: profile.id, // ID univoco fornito da Google
            nome: profile.name.givenName, // Nome dell'utente
            cognome: profile.name.familyName, // Cognome dell'utente
            email: profile.emails[0].value, // Email principale dell'utente
            // Nota: la data di nascita non è fornita da Google, quindi la impostiamo a null
            dataDiNascita: null,
          });
          // Salviamo il nuovo autore nel database
          await author.save();
        }

        // Passiamo l'autore al middleware di Passport
        // Il primo argomento null indica che non ci sono errori
        done(null, author);
      } catch (error) {
        // Se si verifica un errore, lo passiamo a Passport
        done(error, null);
      }
    }
  )
);

//configuriamo la strategy di aut di github
passport.use(
  new GithubStrategy(
    {
      // Usiamo le variabili d'ambiente per le credenziali OAuth di GitHub
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // URL a cui GitHub reindirizzerà dopo l'autenticazione
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let author = await Authors.findOne({ githubId: profile.id });
        if (!author) {
          const [nome, ...cognomeParts] = (
            profile.displayName ||
            profile.username ||
            "GithubUser"
          ).split(" ");
          const cognome = cognomeParts.join(" ");

          // gestiamo la email
          let email;
          if (profile.emails && profile.emails.length > 0) {
            email = profile.emails.find((e) => e.primary || e.verified)?.value;
            if (!email) email = profile.emails[0].value;
          }

          if (!email) {
            email = `${profile.id}@github.example.com`;
            console.log(
              `email non disponibile per ${
                profile.displayName || profile.username
              } - usiamo email di fallback`
            );
          }

          // creare un autore
          author = new Authors({
            githubId: profile.id,
            nome: nome || "GitHub User",
            cognome: cognome,
            email: email,
          });

          await author.save();
        }

        done(null, author);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serializzazione dell'utente per la sessione
// Questa funzione determina quali dati dell'utente devono essere memorizzati nella sessione
passport.serializeUser((user, done) => {
  // Memorizziamo solo l'ID dell'utente nella sessione
  done(null, user.id);
});

// Deserializzazione dell'utente dalla sessione
// Questa funzione viene usata per recuperare l'intero oggetto utente basandosi sull'ID memorizzato
passport.deserializeUser(async (id, done) => {
  try {
    // Cerchiamo l'utente nel database usando l'ID
    const user = await Authors.findById(id);
    // Passiamo l'utente completo al middleware di Passport
    done(null, user);
  } catch (error) {
    // Se si verifica un errore durante la ricerca, lo passiamo a Passport
    done(error, null);
  }
});

// Esportiamo la configurazione di Passport
export default passport;
