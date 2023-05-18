import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import Post from "~/components/Post";
import CommentsList from "~/components/CommentsList";
import CommentForm from "~/components/CommentForm";
const PostId = () => {
  const router = useRouter();

  const postId = router.query?.postId ?? "";

  const {
    data: post,
    isLoading,
    error,
  } = api.post.singlePost.useQuery(
    { postId: postId as string },
    {
      onSuccess: (response) => {
        // console.log(response);
      },
      enabled: Boolean(postId !== undefined && postId !== ""),
    }
  );

  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      {post && (
        <>
          <Post postId={postId} {...post} />
          <CommentForm postId={postId} />
          <CommentsList postId={postId} comments={post.comments} />
        </>
      )}
    </>
  );
};

export default PostId;
