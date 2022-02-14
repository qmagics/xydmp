export interface User {
    UserId?: string;
    HeadIcon?: string;
}

export interface PasswordUser extends User {
    OldPassword: string;
    Password: string;
    RePassword: string;
}
