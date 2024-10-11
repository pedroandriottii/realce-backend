import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendServiceCreatedEmail(userMail: string, serviceId: string) {
        const link = ``;

        await this.resend.emails.send({
            from: 'contato@realcenordeste.com.br',
            to: userMail,
            subject: 'Seu serviço foi cadastrado!',
            html: `<p>Olá,</p>
             <p>Sua prancha foi cadastrada para serviço. Você pode acompanhar o andamento no link abaixo:</p>
             <a href="${link}">Acompanhar Serviço</a>
             <p>Obrigado por confiar na nossa equipe!</p>`,
        });
    }

    async sendStatusUpdatedEmail(userMail: string, serviceId: string, newStatus: string) {
        const link = ``;

        await this.resend.emails.send({
            from: 'contato@realcenordeste.com.br',
            to: userMail,
            subject: 'Status da sua prancha foi atualizado!',
            html: `<p>Olá,</p>
                 <p>O status da sua prancha foi atualizado para: <strong>${newStatus}</strong>.</p>
                 <p>Você pode acompanhar o andamento no link abaixo:</p>
                 <a href="${link}">Acompanhar Serviço</a>
                 <p>Obrigado por confiar na nossa equipe!</p>`,
        });
    }
}
