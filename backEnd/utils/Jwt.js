// Importa la libreria jsonwebtoken per gestire i JSON Web Tokens
import jwt from 'jsonwebtoken';

// Funzione per generare un token JWT
export const generateJWT = (payload) => {
    // Restituisce una Promise per gestire l'operazione in modo asincrono
    return new Promise((resolve, reject) =>
         // Utilizza il metodo sign di jwt per creare un nuovo token
        jwt.sign(
            payload, // Il payload contiene i dati che vogliamo includere nel token (es. ID utente)
            process.env.JWT_SECRET, // La chiave segreta per firmare il token
            { expiresIn: '1 day' }, // Opzioni per la scadenza del token
            (err, token) => {
                if (err) reject(err); // Se ci sono errori, rifiuta la Promise
               else resolve(token); // Altrimenti, risolve la Promise con il token
            }
        )
    );
};

// Funzione per verificare un token JWT
export const verifyJWT = (token) => {
    // Restituisce una Promise per gestire l'operazione in modo asincrono
    return new Promise((resolve, reject) => 
        // Utilizza il metodo verify di jwt per decodificare e verificare il token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // Callback che gestisce il risultato dell'operazione
        if (err) reject(err); // Se ci sono errori, rifiuta la Promise
        else resolve(decoded); // Altrimenti, risolve la Promise con il token decodificato
        })
    );
};