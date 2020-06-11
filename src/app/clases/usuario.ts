import { UserInfo } from 'firebase';

export class Usuario implements UserInfo {
    public displayName: string;
    public email: string;
    public phoneNumber: string;
    public photoURL: string;
    public providerId: string;
    public uid: string;
    public tipo: string;
    public especialidad?: string;
}
