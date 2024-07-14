import mailgun from "mailgun-js";

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

export const sendEmail = async (to,subject,htmlContent) => {
    const data = {
        from: 'bananePiccanti <noreply@yourdomain.com>',
        to,
        subject,
        html: htmlContent
    };
    try {
        const response = await mg.messages().send(data);
        console.log('email inviata con sul cesso', response);
        return response;
    }catch(err){
        console.error('errore mongolo', err);
        throw err;
    }
}
