// pages/tweets.tsx

import fetchTweets from "../lib/queries/fetch-tweets";
import queryClient from "../lib/clients/react-query";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import React from "react";
import { useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";

import Page from "../components/pages/tweets";

const TweetsPage: InferGetServerSidePropsType<
  typeof getServerSideProps
> = ({}) => {
  const { data } = useQuery("tweets", fetchTweets);
  const [session] = useSession();

  if (!session) {
    return <div>Not authenticated.</div>;
  }

  return (
    <>
      <Head>
        <title>All tweets</title>
      </Head>
      <Page tweets={data} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  await queryClient.prefetchQuery("tweets", fetchTweets);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default TweetsPage;