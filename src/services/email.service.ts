import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendServiceCreatedEmail(userMail: string) {
        await this.resend.emails.send({
            from: 'contato@realcenordeste.com.br',
            to: userMail,
            subject: 'Seu serviço foi cadastrado!',
            html: `
                <div
                style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
                    <div
                        style="display: flex; justify-content: space-around; padding: 10px; background-color: #EAF825; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                        <img src="https://i.imgur.com/Kos6NBB.png" alt="Realce Nordeste" style="width: 60px; height: 40px;">
                        <h1 style="color: #000000; text-align: center;">Serviço Cadastrado</h1>
                    </div>
                    <div style="padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                        <p style="color: #333; font-size: 16px; text-align: center;">
                            Olá! Sua prancha foi cadastrada com sucesso para serviço na <strong>Realce Nordeste</strong>. Acompanhe o andamento na sua conta.
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://painel.realcenordeste.com.br/"
                               style="font-size: 16px; font-weight: bold; color: #000000; background-color: #EAF825; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Acompanhar Serviço</a>
                        </div>
                        <p style="color: #777; font-size: 14px; text-align: center;">
                            Obrigado por confiar na nossa equipe!
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
                        <p>Realce Nordeste, Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</p>
                        <p>© 2024 Realce Nordeste. Todos os direitos reservados.</p>
                    </div>
                </div>
            `,
        });
    }

    async sendServiceCreatedEmailWithUser(userMail: string) {
        await this.resend.emails.send({
            from: 'contato@realcenordeste.com.br',
            to: userMail,
            subject: 'Seu serviço foi cadastrado!',
            html: `
                <div
                style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
                    <div
                        style="display: flex; justify-content: space-around; padding: 10px; background-color: #EAF825; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                        <img src="https://i.imgur.com/Kos6NBB.png" alt="Realce Nordeste" style="width: 60px; height: 40px;">
                        <h1 style="color: #000000; text-align: center;">Serviço Cadastrado</h1>
                    </div>
                    <div style="padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                        <p style="color: #333; font-size: 16px; text-align: center;">
                            Olá! Sua prancha foi cadastrada com sucesso para serviço na <strong>Realce Nordeste</strong>.
                        </p>
                        <p style="color: #333; font-size: 16px; text-align: center;">
                            Crie uma conta para acompanhar o andamento no link abaixo:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://painel.realcenordeste.com.br/"
                               style="font-size: 16px; font-weight: bold; color: #000000; background-color: #EAF825; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Criar Conta</a>
                        </div>
                        <p style="color: #333; font-size: 14px; text-align: center;">
                            Use o mesmo email cadastrado no serviço!
                        </p>
                        <p style="color: #777; font-size: 14px; text-align: center;">
                            Obrigado por confiar na nossa equipe!
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
                        <p>Realce Nordeste, Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</p>
                        <p>© 2024 Realce Nordeste. Todos os direitos reservados.</p>
                    </div>
                </div>
            `,
        });
    }

    async sendStatusReadyEmail(userMail: string) {
        await this.resend.emails.send({
            from: 'contato@realcenordeste.com.br',
            to: userMail,
            subject: 'Sua prancha está pronta!',
            html: `
                <div
                style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
                <div
                    style="display: flex; justify-content: space-around; padding: 10px; background-color: #EAF825; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <img src="https://i.imgur.com/Kos6NBB.png" alt="Realce Nordeste" style="width: 60px; height: 40px;">
                    <h1 style="color: #000000; text-align: center;">Sua Prancha Está Pronta!</h1>
                </div>
                <div style="padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <p style="color: #333; font-size: 16px; text-align: center;">
                        Olá! Sua prancha está pronta para ser retirada na <strong>Realce Nordeste</strong>.
                    </p>
                    <p style="color: #333; font-size: 16px; text-align: center;">
                        Acesse o painel abaixo para mais detalhes.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://painel.realcenordeste.com.br/"
                        style="font-size: 16px; font-weight: bold; color: #000000; background-color: #EAF825; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Acessar Painel</a>
                    </div>
                    <p style="color: #777; font-size: 14px; text-align: center;">
                        Obrigado por confiar na nossa equipe!
                    </p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
                    <p>Realce Nordeste, Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</p>
                    <p>© 2024 Realce Nordeste. Todos os direitos reservados.</p>
                </div>
            </div>
            `,
        });
    }


    async sendStatusDeliveredEmail(userMail: string) {
        await this.resend.emails.send({
            from: 'contato@realcenordeste.com.br',
            to: userMail,
            subject: 'Sua prancha foi entregue!',
            html: `
                <div
                style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
                    <div
                        style="display: flex; justify-content: space-around; padding: 10px; background-color: #EAF825; align-items: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                        <img src="https://i.imgur.com/Kos6NBB.png" alt="Realce Nordeste" style="width: 60px; height: 40px;">
                        <h1 style="color: #000000; text-align: center;">Sua Prancha Foi Entregue!</h1>
                    </div>
                    <div style="padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <p style="color: #333; font-size: 16px; text-align: center;">
                            Olá! Sua prancha foi entregue com sucesso na <strong>Realce Nordeste</strong>.
                        </p>
                        <p style="color: #333; font-size: 16px; text-align: center;">
                            Acesse o painel abaixo para mais informações.
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="www.painel.realcenordeste.com.br"
                               style="font-size: 16px; font-weight: bold; color: #000000; background-color: #EAF825; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Acessar Painel</a>
                        </div>
                        <p style="color: #777; font-size: 14px; text-align: center;">
                            Obrigado por confiar na nossa equipe!
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
                        <p>Realce Nordeste, Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</p>
                        <p>© 2024 Realce Nordeste. Todos os direitos reservados.</p>
                    </div>
                </div>
            `,
        });
    }
}
