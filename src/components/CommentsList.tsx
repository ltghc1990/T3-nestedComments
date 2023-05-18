import React, { useMemo, useState } from "react";
import { type Comment } from "./Post";

import IconBtn from "./IconBtn";
import { HeartIcon, EditIcon, DeleteIcon, ReplyIcon } from "./IconBtn";
type Comments = Comment[];

type Props = {
  comments: Comments;
  id: string;
};

// we need to arrange the comments array into its nested form.
// comments list should take the comments and sort them into their nested form

// gunna need post id????
const CommentsList = ({ id, comments }: Props) => {
  console.log(comments);
  // seperate the comments into 2 arrays. ones with parentids and ones without
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
  console.log(commentsById);

  // root comments
  const root = commentsById[null] as (typeof Comment)[];
  // provide the the parentid to select the replies
  const getReplies = (parentId: string): (() => Comment[]) => {
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
              <CommentItem {...comment} getReplies={getReplies} />
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

const CommentItem = ({
  id,
  message,
  user,
  createdAt,
  getReplies,
}: Comment & { getReplies: (id: string) => Comment[] }) => {
  // getReplies can also return undefined.
  // see the comment has children to render
  const [showComments, setShowComments] = useState(false);

  const childComments = getReplies(id);
  console.log(childComments);
  return (
    <>
      <div className="my-2 rounded-md border border-slate-300 sm:p-4 md:px-8">
        <div className="flex justify-between text-sky-600">
          <span className="font-semibold capitalize">{user.name}</span>
          <span>{dateFormatter.format(Date.parse(createdAt))}</span>
        </div>
        <div>{message}</div>
        <div className="mt-4 flex gap-4 text-sky-600">
          <IconBtn Icon={HeartIcon} aria-label="Like">
            2
          </IconBtn>
          <IconBtn Icon={ReplyIcon} />
          <IconBtn Icon={EditIcon} />
          <IconBtn Icon={DeleteIcon} color="text-red-600" />
        </div>
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
                <div key={item.id} className={`ml-[${(index + 1) * 10}px]`}>
                  <CommentItem {...item} getReplies={getReplies} />
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
