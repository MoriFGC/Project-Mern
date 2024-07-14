// Importa il modulo 'crypto' di Node.js, che fornisce funzionalità crittografiche
import crypto from 'crypto';

// Genera 64 byte di dati casuali e li converte in una stringa esadecimale
// - crypto.randomBytes(64): Crea un buffer di 64 byte con dati casuali crittograficamente forti
// - .toString('hex'): Converte il buffer in una stringa esadecimale
// Il risultato è una stringa di 128 caratteri esadecimali (ogni byte diventa 2 caratteri hex)
console.log(crypto.randomBytes(64).toString('hex'));