import { WithId, Document } from "mongodb";

export interface User extends WithId<Document> {
    email: string;
    password: string;
    name: string;
}
