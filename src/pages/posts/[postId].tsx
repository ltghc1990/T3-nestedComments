import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import Post from "~/components/Post";
import CommentsList from "~/components/CommentsList";
const PostId = () => {
  const router = useRouter();

  const { postId } = router.query;
  console.log(postId);

  const {
    data: post,
    isLoading,
    error,
  } = api.post.singlePost.useQuery(
    { postId: postId },
    {
      onSuccess: (response) => {
        console.log(response);
      },
      enabled: Boolean(postId !== undefined),
    }
  );

  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      {post && (
        <>
          <Post id={postId} {...post} />
          <CommentsList id={postId} comments={post.comments} />
        </>
      )}
    </>
  );
};

export default PostId;
