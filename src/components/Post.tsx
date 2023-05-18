import React, { type ReactNode } from "react";

export type Comment = {
  id: string;
  message: string;
  parentId: null | string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
};

type PostProps = {
  postId: string;
  body: string;
  title: string;
  comments: Comment[];
};
const Post = ({ postId, ...post }: PostProps) => {
  return (
    <div key={postId}>
      <h1 className="my-4 text-3xl font-bold text-gray-800">{post.title}</h1>
      <article>{post.body}</article>
    </div>
  );
};

export default Post;
