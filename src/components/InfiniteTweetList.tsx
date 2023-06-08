import React, { useEffect, useRef, useState } from "react";
import { VscHeartFilled, VscHeart } from "react-icons/vsc";

import { useInView } from "framer-motion";
import Link from "next/link";
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";
import IconHoverEffect from "./IconHoverEffect";

import { api } from "~/utils/api";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

const InfiniteTweetList = ({
  tweets,
  isError,
  isLoading,
  fetchNewTweets,
  hasMore,
}: InfiniteTweetListProps) => {
  const bottemRef = useRef(null);
  const isInView = useInView(bottemRef);
  console.log(bottemRef);
  useEffect(() => {
    // if in view call function
    // consolelog the element
    if (isInView) {
      if (hasMore) {
        fetchNewTweets();
      }
    }
  }, [isInView]);

  // had to comment out the if statements as it was making the ref stay null....

  // if (isLoading) return <h1>Loading...</h1>;
  // if (isError) return <h1>Error...</h1>;

  // if (tweets == null || tweets.length === 0) {
  //   return <h2 className="my-4 text-center text-2xl">No tweets....</h2>;
  // }

  return (
    <div>
      {tweets &&
        tweets.map((tweet) => {
          return <TweetCard key={tweet.id} {...tweet} />;
        })}
      <div ref={bottemRef}>bottem</div>
    </div>
  );
};

export default InfiniteTweetList;

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

const TweetCard = ({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Tweet) => {
  const trpcUtils = api.useContext();

  const { mutate, isLoading, isError } = api.tweet.toggleLike.useMutation({
    onSuccess: async ({ addedLike }) => {
      if (addedLike) {
        await trpcUtils.tweet.infiniteFeed.invalidate();
      }
    },
  });

  const handleToggleLike = () => {
    mutate({ id });
  };

  return (
    <li className="flex gap-4 border-b p-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton
          onClick={handleToggleLike}
          isLoading={isLoading}
          likeCount={likeCount}
          likedByMe={likedByMe}
        />
      </div>
    </li>
  );
};

type HeartButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  likedByMe: boolean;
  likeCount: number;
};

const HeartButton = ({
  likedByMe,
  likeCount,
  isLoading,
  onClick,
}: HeartButtonProps) => {
  const session = useSession();

  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== "authenticated") {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }
  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <IconHoverEffect red>
        <HeartIcon
          className={`transition-colors duration-200 ${
            likedByMe
              ? "fill-red-500"
              : "group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  );
};
