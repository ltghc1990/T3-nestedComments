import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import React from "react";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import Link from "next/link";
import IconHoverEffect from "~/components/IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import { ProfileImage } from "~/components/ProfileImage";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import { useSession } from "next-auth/react";
import Button from "~/components/Button";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id });

  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // onSuccess: (res) => console.log(res),
    }
  );

  if (profile == null || profile.name == null)
    return <ErrorPage statusCode={404} />;
  return (
    <>
      <Head>
        <title>{`Twitter Clone - ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetsCount}{" "}
            {getPlural(profile.tweetsCount, "Tweet", "Tweets")} -{" "}
            {profile.followersCount}{" "}
            {getPlural(profile.followersCount, "Follower", "Followers")} -{" "}
            {profile.followersCount} Following
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          userId={id}
          onClick={() => null}
        />
      </header>
      <main>
        <InfiniteTweetList
          tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage || undefined}
          fetchNewTweets={tweets.fetchNextPage}
        />
      </main>
    </>
  );
};

const FollowButton = ({
  userId,
  isFollowing,
  onClick,
}: {
  userId: string;
  isFollowing: boolean;
  onClick: () => void;
}) => {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id == userId) {
    return null;
  }
  return (
    <Button onClick={onClick} small gray={isFollowing}>
      {isFollowing ? "unFollow" : "follow"}
    </Button>
  );
};

const pluralRules = new Intl.PluralRules();
const getPlural = (number: number, singlar: string, plural: string) => {
  return pluralRules.select(number) === "one" ? singlar : plural;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  // helper to prefetch data
  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default ProfilePage;

// this page is going to be static-ly served instead of serverside
