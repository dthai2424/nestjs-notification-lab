export interface AuthUser {
    sub: number;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user: AuthUser;
        }
    }
}

export { };