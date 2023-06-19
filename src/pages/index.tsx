import { useState } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import NewTweetForm from "~/components/NewTweetForm";

import { api } from "~/utils/api";

const TABS = ["Recent", "Following"] as const;

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();
  return (
    <>
      <main>
        <header className="sticky top-0 z-40 border bg-white pt-2">
          <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
          {session.status === "authenticated" && (
            <div className="flex">
              {TABS.map((tab) => {
                return (
                  <button
                    key={tab}
                    className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                      tab === selectedTab
                        ? "border-b-4 border-b-blue-500 font-bold"
                        : ""
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}
        </header>
        <NewTweetForm />
        {selectedTab === "Recent" ? <RecentTweets /> : <FollowingTweets />}
      </main>
    </>
  );
};

export default Home;

const RecentTweets = () => {
  // useInfiniteQuery returns to use on object with a pages array
  // the page is managed for use, we just need to provide the cursor
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onSuccess: (res) => console.log(res),
    }
  );

  // user object inside of tweets, so we are gunna flatten it for convenience

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage || undefined}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
};

const FollowingTweets = () => {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onSuccess: (res) => console.log(res),
    }
  );

  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage || undefined}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
};
