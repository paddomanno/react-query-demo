/**
 * Model User
 *
 */
export type User = {
  id: number;
  email: string;
  username: string;
  realname: string | null;
  bio: string;
  website: string;
  joinedDate: Date;
};

/**
 * Model Post
 *
 */
export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdDate: Date;
};

/**
 * Model Tag
 *
 */
export type Tag = {
  name: string;
};

/**
 * Custom
 */
export type PostFull = Post & { author: User; tags: Tag[] };
