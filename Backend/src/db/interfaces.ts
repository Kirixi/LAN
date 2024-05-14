export interface User {
	_id: string;
	email: string;
	password: string;
	username: string;
	joined: string;
	status: string;
}

export interface Post {
	_id: string;
	content: string;
	link: string | null;
	parent_id: string;
	username: string;
	createdAt: Date;
	updatedAt: Date;
	comments: Object[];
	deleted: boolean;
}

export interface Comment {
	_id: string;
	username: string;
	content: string;
	user_id: string;
	createdAt: Date;
	updatedAt: Date;
	parent_id: string;
	deleted: boolean;
}

export interface Follows {
	_id: string;
	user_id: string;
	follower_id: string;
	follower_username: string;
}
