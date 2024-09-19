export class AuthEntity {
    accessToken: string;
    user: {
        id: string;
        name: string
        email: string
        phone: string
        role: string
    }
}