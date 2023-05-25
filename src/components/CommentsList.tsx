import React, { useMemo, useState } from "react";
import { type Comment } from "./Post";

import { api } from "~/utils/api";

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

  const closeForm = () => setSelectedCommentId("");

  const handleReplyForm = (id: string) => {
    setSelectedCommentId(id);
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
                closeForm={closeForm}
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
// CommentsList will first render root lv commentitems, then if there are nestedComments, commentItems  will call on itself.

// for CommentForm
// by replying to a comment, that comment id becomes the parentId for the comment we are creating

const CommentItem = ({
  id,
  message,
  user,
  createdAt,
  getReplies,
  postId,
  selectedCommentId,
  handleReplyForm,
  closeForm,
}: Comment & {
  getReplies: (id: string) => Comment[];
  postId: string;
  selectedCommentId: string;
  handleReplyForm: (id: string) => void;
  closeForm: () => void;
}) => {
  // getReplies can also return undefined.
  // see the comment has children to render
  const [showComments, setShowComments] = useState(false);
  type IconView = "reply" | "edit" | "";
  const [iconView, setIconView] = useState<IconView>("");

  const childComments = getReplies(id);
  // console.log(childComments);

  const match: boolean = id === selectedCommentId;

  const handleIconClick = (view: IconView) => {
    // need to check id to see if we are clicking the same comment or another
    if (!match) {
      // clicking on another comment
      handleReplyForm(id);
      setIconView(view);
    } else {
      if (view === iconView) {
        // same id same view means we want to close the form
        setIconView("");
      } else {
        // same id, diff view, means we want change view
        setIconView(view);
      }
    }
  };

  const utils = api.useContext();
  const { mutate: deleteComment } = api.comment.deleteComment.useMutation();

  return (
    <>
      <div className="my-2 rounded-md border border-slate-300 sm:p-4 md:px-8">
        <div className="flex justify-between text-sky-600">
          <span className="font-semibold capitalize">{user.name}</span>
          <span>{dateFormatter.format(createdAt)}</span>
        </div>
        {match && iconView === "edit" ? (
          <>
            <p>edit: </p>

            <CommentForm
              postId={postId}
              autoFocus={true}
              initialValue={message}
              closeForm={closeForm}
              editing={id}
            />
          </>
        ) : (
          <div>{message}</div>
        )}

        <div className="mt-4 flex gap-4 text-sky-600">
          <IconBtn Icon={HeartIcon} aria-label="Like">
            2
          </IconBtn>
          <IconBtn
            Icon={ReplyIcon}
            isActive={id === selectedCommentId && iconView === "reply"}
            onClick={() => handleIconClick("reply")}
          />
          <IconBtn
            Icon={EditIcon}
            isActive={id === selectedCommentId && iconView === "edit"}
            onClick={() => handleIconClick("edit")}
          />
          <IconBtn
            Icon={DeleteIcon}
            color="text-red-600"
            onClick={() =>
              deleteComment(id, {
                onSuccess: (id) => {
                  // find the id in local state and remove it.
                  utils.post.invalidate();
                },
              })
            }
          />
        </div>

        {match && iconView === "reply" && (
          <CommentForm
            postId={postId}
            autoFocus={true}
            parentId={id}
            closeForm={closeForm}
          />
        )}
      </div>
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
                    closeForm={closeForm}
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
