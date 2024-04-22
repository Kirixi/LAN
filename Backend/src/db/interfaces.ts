import { WithId, Document } from "mongodb";

export interface User extends WithId<Document> {
  email: string;
  password: string;
  name: string;
  joined: string;
}

export interface Post extends WithId<Document> {
  content: string;
  link: string | null;
  parent_id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Object[],
  deleted: boolean;
}

export interface Comment extends WithId<Document> {
  username: string;
  content: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  parent_id: string;
  deleted: boolean;
}
