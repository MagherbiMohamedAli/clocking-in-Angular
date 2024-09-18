import { Role } from "./role";
import { Status } from "./status";

export class AuthResponse {
    email!: string;
    accessToken!: string;
    id!: number;
    username!: string;
    roles!: Role[];
    nom!: string;          
    prenom!: string;  
    status!: Status;
    workMode!: String;
}
