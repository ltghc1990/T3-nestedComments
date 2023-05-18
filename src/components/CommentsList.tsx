import React, { useMemo, useState } from "react";
import { type Comment } from "./Post";

import CommentForm from "./CommentForm";
import IconBtn from "./IconBtn";
import { HeartIcon, EditIcon, DeleteIcon, ReplyIcon } from "./IconBtn";
type Comments = Comment[];

type Props = {
  comments: Comments;
  postId: string;
};

// we need to arrange the comments array into its nested form.
// comments list should take the comments and sort them into their nested form

// gunna need post id????
const CommentsList = ({ postId, comments }: Props) => {
  // there needs to be only one CommentForm showing at a time
  const [selectedCommentId, setSelectedCommentId] = useState("");
  // console.log(comments);
  // seperate the comments into 2 arrays. ones with parentids and ones without

  const handleReplyForm = (id: string) => {
    if (id === selectedCommentId) {
      setSelectedCommentId("");
    } else {
      setSelectedCommentId(id);
    }
  };
  const commentsById = useMemo(() => {
    if (comments === null) return [];

    const group = {};

    comments.forEach((comment) => {
      // if no parent id create a empty array
      // if doesnt not exist assign it a empty array
      group[comment.parentId] ||= [];
      // take existing or emtpy array and add the comment to it
      group[comment.parentId].push(comment);
    });

    return group;
  }, [comments]);
  // console.log(commentsById);

  // root comments
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const root = commentsById[null];
  // provide the the parentid to select the replies
  const getReplies = (parentId: string): Comment[] => {
    return commentsById[parentId];
  };

  if (!root) {
    return (
      <h3 className="my-4 text-2xl font-semibold text-gray-800">No Comments</h3>
    );
  }
  return (
    <ul>
      <h3 className="my-4 text-2xl font-semibold text-gray-800"> Comments</h3>
      {root &&
        root.map((comment) => {
          return (
            <div key={comment.id}>
              <CommentItem
                {...comment}
                getReplies={getReplies}
                postId={postId}
                selectedCommentId={selectedCommentId}
                handleReplyForm={handleReplyForm}
              />
            </div>
          );
        })}
    </ul>
  );
};

export default CommentsList;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

// super confusing but here goes....
// CommentsList will first render root lv commentitems, then if there are nestedComments, it will call on itself.

// for CommentForm
// by replying to a comment, that comment dd becomes the parentId for the comment we are creating

const CommentItem = ({
  id,
  message,
  user,
  createdAt,
  getReplies,
  postId,
  selectedCommentId,
  handleReplyForm,
}: Comment & {
  getReplies: (id: string) => Comment[];
  postId: string;
  selectedCommentId: string;
  handleReplyForm: (id: string) => void;
}) => {
  // getReplies can also return undefined.
  // see the comment has children to render
  const [showComments, setShowComments] = useState(false);

  const childComments = getReplies(id);
  // console.log(childComments);
  return (
    <>
      <div className="my-2 rounded-md border border-slate-300 sm:p-4 md:px-8">
        <div className="flex justify-between text-sky-600">
          <span className="font-semibold capitalize">{user.name}</span>
          <span>{dateFormatter.format(createdAt)}</span>
        </div>
        <div>{message}</div>
        <div className="mt-4 flex gap-4 text-sky-600">
          <IconBtn Icon={HeartIcon} aria-label="Like">
            2
          </IconBtn>
          <IconBtn Icon={ReplyIcon} onClick={() => handleReplyForm(id)} />
          <IconBtn Icon={EditIcon} />
          <IconBtn Icon={DeleteIcon} color="text-red-600" />
        </div>

        {selectedCommentId === id && (
          <CommentForm postId={postId} autoFocus={true} parentId={id} />
        )}
      </div>
      {/* {childComments &&
        childComments.map((item, index) => {
 
          return (
            <div key={item.id} className={`ml-[${(index + 1) * 10}px]`}>
              <CommentItem {...item} getReplies={getReplies} />
            </div>
          );
        })} */}
      {childComments && (
        <>
          <div className={`${showComments ? "block" : "hidden"} `}>
            <button
              aria-label="Hide Replies"
              className="border-b-2  "
              onClick={() => setShowComments(false)}
            >
              hide replies
            </button>
            {childComments.map((item, index) => {
              return (
                // <div key={item.id} className={`ml-[${(index + 1) * 20}px]`}>
                <div key={item.id} className="ml-[20px]">
                  <CommentItem
                    {...item}
                    getReplies={getReplies}
                    postId={postId}
                    selectedCommentId={selectedCommentId}
                    handleReplyForm={handleReplyForm}
                  />
                </div>
              );
            })}
          </div>
          <button
            className={`${showComments ? "hidden" : ""}  btn`}
            onClick={() => setShowComments(true)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  );
};
