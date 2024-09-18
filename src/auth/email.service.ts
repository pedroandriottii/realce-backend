import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: 'contato@realcenordeste.com.br',
        to: email,
        subject: 'Confirme seu email',
        html: `<p>Clique no link para confirmar seu email: <a href="${confirmLink}">${confirmLink}</a></p>`,
    });
};
