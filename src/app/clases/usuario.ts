import { UserInfo } from 'firebase';
// import { TipoUsuario } from '../enums/tipo-usuario.enum';

export class Usuario implements UserInfo {
    public displayName: string;
    public email: string;
    public phoneNumber: string;
    public photoURL: string;
    public providerId: string;
    public uid: string;
    public tipo: string;
}
