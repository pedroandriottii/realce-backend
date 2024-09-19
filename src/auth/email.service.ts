import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: 'contato@realcenordeste.com.br',
        to: email,
        subject: 'Seu Código de Verificação',
        html: `<p>Seu código de verificação é: <strong>${token}</strong></p>
               <p>Por favor, insira esse código na tela de verificação para confirmar seu e-mail.</p>`,
    });
};
