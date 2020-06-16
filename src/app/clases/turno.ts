export class Turno {
    public uid: string;
    public cliente: string;
    public especialista: string;
    public consultorio: string;
    public fecha: string;
    public hora: number;
    public estado: string;
    public reseña?: string;
    public calificacionClinica?: number;
    public calificacionEspecialista?: number;
    public observacionesCliente?: string;
}
