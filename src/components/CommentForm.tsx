import React, { useState } from "react";
import { api } from "~/utils/api";

import { type RouterInputs } from "~/utils/api";

type MutationInput = RouterInputs["comment"]["createComment"];

// closeform prop
// CommentsList --> CommentsItem---> CommentForm
const CommentForm = ({
  autoFocus = false,
  postId,
  parentId,
  closeForm,
  initialValue = "",
}: MutationInput & {
  autoFocus: boolean;
  parentId?: string;
  closeForm: () => void;
  initialValue: string;
}) => {
  const utils = api.useContext();
  const [message, setMessage] = useState(initialValue);

  const { mutate, isLoading, error } = api.comment.createComment.useMutation();
  // when i hit the edit or reply button, this should show up
  // creating a comment.
  // needs the post id.
  // if it is a reply to another comment, then need comment id as well

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // hard code the userid?
    const kyle = "8a23e010-c959-4e68-8d45-26a2c9f2e7ec";
    const sally = "d1cf8add-3005-4719-9d7f-10de64f1ea1b";

    mutate(
      {
        message,
        userId: kyle,
        postId,
        parentId,
      },
      {
        onError: (error) => {},
        onSuccess: (response) => {
          console.log("new comment add:", response);
          setMessage("");
          // need to close the form aswell.... the boolean toggle exist on the Comments list
          // invalidate whole post...
          if (closeForm) {
            closeForm();
          }
          utils.post.singlePost.invalidate();
        },
      }
    );

    // the server can get the post id from url, but since we are using trpc only stuff we pass to the input gets thru..
  };
  return (
    <div className="my-8">
      <div className="my-4 text-red-600">{error?.message}</div>
      <form className="px-4" onSubmit={handleSubmit}>
        <div className="flex gap-4 ">
          <textarea
            autoFocus={autoFocus}
            className="min-h-[100px] w-full rounded-lg border-2 border-sky-600 p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={isLoading} className="btn">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
