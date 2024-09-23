import { User } from "./user";

export class Project {
    id!: number;
    title!: string;
    description!: string;
    clientName!: string;
    startDate!: string;
    endDate!: string;
    members!: User[];
}
