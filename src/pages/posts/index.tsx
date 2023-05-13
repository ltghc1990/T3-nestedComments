import React from "react";
import Link from "next/link";
import { type NextPage } from "next";
import { api } from "~/utils/api";

const PostPage: NextPage = () => {
  const { data, isLoading, error } = api.post.getPosts.useQuery();

  if (isLoading) <p>Loading....</p>;

  if (!data) <div>no data...</div>;

  return (
    <>
      <div>Posts page</div>
      {data &&
        data.map((post) => {
          return (
            <div key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </div>
          );
        })}
    </>
  );
};

export default PostPage;
