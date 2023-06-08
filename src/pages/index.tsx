import { type NextPage } from "next";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import NewTweetForm from "~/components/NewTweetForm";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <main>
        <header className="sticky top-0 z-40 border bg-white pt-2">
          <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        </header>
        <NewTweetForm />
        <RecentTweets />
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
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
};
