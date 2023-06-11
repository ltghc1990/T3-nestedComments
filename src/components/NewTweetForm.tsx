import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  type FormEvent,
} from "react";
import Button from "./Button";
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;

  textArea.style.height = "20";
  textArea.style.height = `${textArea?.scrollHeight}px`;
}

function Form() {
  const trpcUtils = api.useContext();
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  // the first render of our component is incorrect because of the ref
  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const { mutate: createTweet } = api.tweet.create.useMutation();

  const handleOnCreateTweet = (e: FormEvent) => {
    e.preventDefault();
    createTweet(
      { content: inputValue },
      {
        onSuccess: (newTweet) => {
          setInputValue("");

          if (session.status !== "authenticated") return;
          // take response and update local state
          trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
            if (oldData == null || oldData.pages[0] == null) return;

            const newCacheTweet = {
              ...newTweet,
              likeCount: 0,
              likedByMe: false,
              user: {
                id: session.data.user.id,
                name: session.data.user.name,
                image: session.data.user.image,
              },
            };

            return {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  tweets: [newCacheTweet, ...oldData.pages[0].tweets],
                },
                ...oldData.pages.slice(1),
              ],
            };
          });
        },
      }
    );
  };

  if (session.status !== "authenticated") return null;
  return (
    <form
      className="flex flex-col gap-2 px-4 py-2"
      onSubmit={handleOnCreateTweet}
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          style={{ height: 20 }}
          className="flex-grow overflow-hidden  p-4 text-lg outline-blue-500"
          placeholder="TWEET"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
}

const NewTweetForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Form />;
};

export default NewTweetForm;
