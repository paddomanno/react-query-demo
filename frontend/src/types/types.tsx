// copied from backend\node_modules\.prisma\client\index.d.ts

/**
 * Model User
 *
 */
export type User = {
  id: number;
  email: string;
  username: string;
  realname: string | null;
  imgUrl: string | null;
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
  imgUrl: string | null;
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
export type PostWithTags = Post & { tags: Tag[] };
export type PostFull = Post & { author: User; tags: Tag[] };
export type NewPost = Omit<Post, 'id' | 'createdDate'> & {
  tags: Tag[];
};
