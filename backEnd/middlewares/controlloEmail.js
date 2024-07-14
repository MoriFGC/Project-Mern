const controlloMail = (req, res, next) => {
    const emailAutorizzata = 'autorizzato@gmai.com';
    const mailUtente = req.headers['user-email'];

    if(emailAutorizzata === mailUtente) {
        next()
    } else {
        res.status(403).json({message: 'ACCESSO NEGATO, UTENTE NON AUTORIZZATO'})
    }
};

export default controlloMail