import { WithId, Document } from "mongodb";

export interface User extends WithId<Document> {
  email: string;
  password: string;
  name: string;
}

export interface Post extends WithId<Document> {
  content: string;
  link: string | null;
  parent_id: string;
  createdAt: Date;
}

export interface Comment extends WithId<Document> {
  userEmail: string;
  content: string;
  link: string | null;
  createdAt: Date;
  parentId: string;
}
