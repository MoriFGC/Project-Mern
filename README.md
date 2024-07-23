# Strive Blog

Strive Blog è un'applicazione full-stack MERN (MongoDB, Express, React, Node.js) che permette agli utenti di creare, leggere, aggiornare ed eliminare post del blog. Presenta funzionalità di autenticazione utente, sistema di commenti e un design responsivo.

## Caratteristiche Principali

1. **Autenticazione Utente**
   - Funzionalità di registrazione e login
   - Integrazione OAuth con Google e GitHub
   - Autenticazione basata su JWT

2. **Post del Blog**
   - Creazione, lettura, aggiornamento ed eliminazione dei post
   - Editor di testo ricco per il contenuto dei post
   - Caricamento di immagini per le copertine dei post utilizzando Cloudinary

3. **Commenti**
   - Aggiunta, modifica ed eliminazione dei commenti sui post
   - Struttura dei commenti annidata

4. **Profili Utente**
   - Visualizzazione dei profili degli autori
   - Aggiornamento delle informazioni utente e dell'avatar

5. **Design Responsivo**
   - Layout adattabile ai dispositivi mobili
   - Opzione modalità scura

6. **Funzionalità di Ricerca**
   - Ricerca dei post per titolo

7. **Paginazione**
   - Caricamento dei post in lotti per migliorare le prestazioni

## Stack Tecnologico

- **Frontend**: React, TailwindCSS, Flowbite React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Autenticazione**: JWT, Passport.js
- **Gestione File**: Cloudinary

## Componenti Principali

- `App.jsx`: Componente principale che gestisce il routing e lo stato globale dell'applicazione
- `Home.jsx`: Pagina principale che mostra l'elenco dei post
- `SinglePost.jsx`: Visualizzazione dettagliata di un singolo post con commenti
- `CreatePost.jsx`: Form per la creazione di nuovi post
- `Login.jsx` e `Register.jsx`: Componenti per l'autenticazione utente
- `NavBar.jsx`: Barra di navigazione con gestione dello stato di login
- `Footer.jsx`: Piè di pagina con toggle per la modalità scura

## API e Servizi

- `Api.js`: Modulo che gestisce tutte le chiamate API al backend
- Integrazione con Cloudinary per la gestione delle immagini
- Utilizzo di Passport.js per l'autenticazione OAuth

## Funzionalità Aggiuntive

- Gestione degli errori e feedback utente
- Controlli di autorizzazione per le operazioni CRUD
- Interfaccia utente intuitiva con feedback visivi e animazioni

Questo progetto dimostra una solida comprensione dello sviluppo full-stack, con particolare attenzione all'esperienza utente e alle moderne pratiche di sviluppo web.

sito https://project-mern-nine.vercel.app/login
