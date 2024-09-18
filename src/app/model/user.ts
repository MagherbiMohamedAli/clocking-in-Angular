import { Role } from "./role";
import { Status } from "./status";

export class User {
    nom!: string;
    prenom!: string;
    id!: number;
    email!: string;
    username!: string;
    roles!: Role[];
    statuses?: Status;
    time?: any;
    workMode?: String;
    constructor() { }
}

