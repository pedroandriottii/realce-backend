import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: 'contato@realcenordeste.com.br',
        to: email,
        subject: 'Seu Código de Verificação',
        html: `
          <div
    style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;; border: 1px solid #ddd; border-radius: 10px;">
    <div
        style="display: flex; justify-content: space-around; padding: 10px; background-color: #EAF825; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
        <img src="https://i.imgur.com/Kos6NBB.png" alt="Realce Nordeste" style="width: 60; height: 40px;">
        <h1 style="color: #000000; text-align: center;">Seu Código de Verificação</h1>
    </div>
    <div style="padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="color: #333; font-size: 16px; text-align: center;">
            Olá, obrigado por se cadastrar na <strong>Realce Nordeste</strong>! Para completar seu cadastro e
            verificar seu e-mail, por favor insira o código abaixo:
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <span
                style="font-size: 28px; font-weight: bold; color: #000000; background-color: #EAF825; padding: 10px 20px; border-radius: 5px; display: inline-block;">${token}</span>
        </div>
        <p style="color: #333; font-size: 16px; text-align: center;">
            Por favor, insira esse código na tela de verificação para confirmar seu e-mail.
        </p>
        <p style="color: #777; font-size: 14px; text-align: center;">
            Se você não solicitou este e-mail, pode ignorá-lo.
        </p>
    </div>
    <a href="https://www.instagram.com/consertos.realce/" target="__blank"> Acompanhe o instagram de consertos! </a>
    <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
        <p>Realce Nordeste, Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</p>
        <p>© 2024 Realce Nordeste. Todos os direitos reservados.</p>
    </div>
</div>
        `,
    });
};

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
    await resend.emails.send({
        from: 'contato@realcenordeste.com.br',
        to: email,
        subject: 'Redefinição de Senha',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
              <div style="display: flex; justify-content: space-around; padding: 10px; background-color: #EAF825; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                  <img src="https://i.imgur.com/Kos6NBB.png" alt="Realce Nordeste" style="width: 60px; height: 40px;">
                  <h1 style="color: #000000; text-align: center;">Redefinição de Senha</h1>
              </div>
              <div style="padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <p style="color: #333; font-size: 16px; text-align: center;">
                      Olá, parece que você solicitou uma redefinição de senha para sua conta na <strong>Realce Nordeste</strong>.
                  </p>
                  <div style="text-align: center; margin: 20px 0;">
                      <a href="${resetLink}" style="font-size: 18px; font-weight: bold; color: #FFFFFF; background-color: #EAF825; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Redefinir Senha</a>
                  </div>
                  <p style="color: #333; font-size: 16px; text-align: center;">
                      Se você não solicitou essa redefinição, pode ignorar este email.
                  </p>
              </div>
              <a href="https://www.instagram.com/consertos.realce/" target="__blank"> Acompanhe o instagram de consertos! </a>
              <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
                  <p>Realce Nordeste, Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</p>
                  <p>© 2024 Realce Nordeste. Todos os direitos reservados.</p>
              </div>
          </div>
        `,
    });
};