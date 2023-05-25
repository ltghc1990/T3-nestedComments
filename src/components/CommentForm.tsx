import React, { useState } from "react";
import { api } from "~/utils/api";

import { type RouterInputs } from "~/utils/api";

type MutationInput = RouterInputs["comment"]["createComment"];

// instead of editing being a boolean, jsut gunna pass the id to it, so if it exist it means we are editing.

// closeform prop
// CommentsList --> CommentsItem---> CommentForm
const CommentForm = ({
  autoFocus = false,
  postId,
  parentId,
  closeForm,
  initialValue = "",
  editing,
}: MutationInput & {
  autoFocus: boolean;
  parentId?: string;
  closeForm: () => void;
  initialValue: string;
  editing?: string;
}) => {
  const utils = api.useContext();
  const [message, setMessage] = useState(initialValue);

  const { mutate: editMutation } = api.comment.editComment.useMutation();

  const { mutate, isLoading, error } = api.comment.createComment.useMutation();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (editing) {
      editComment();
    } else {
      createComment();
    }

    // the server can get the post id from url, but since we are using trpc only stuff we pass to the input gets thru..
  };

  const editComment = () => {
    // remember when we create a comment it'll auto generate a new id and add the commentId as parentId

    editMutation(
      { id: editing, message },
      {
        onSuccess: (response) => {
          console.log(response);
          utils.post.singlePost.invalidate();
          closeForm();
          // response is a message string that i can use to replace local state
          // find the comment in the commentlist and then change the message
        },
      }
    );
  };

  const createComment = () => {
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
