import Twitter from "twitter-lite";

type TwitterV2Response<ResultType> = {
  data: ResultType[];
  meta: { next_token?: string };
};

export async function getAllResultsFromPagination<ResultType>(
  T: Twitter,
  getResponseFn: (paginationProps: {
    pagination_token?: string;
  }) => Promise<TwitterV2Response<ResultType>>
): Promise<ResultType[]> {
  let nextToken;
  let allResults: ResultType[] = [];

  do {
    const response = (await getResponseFn(
      Boolean(nextToken) ? { pagination_token: nextToken } : {}
    )) as TwitterV2Response<ResultType>;

    allResults = allResults.concat(response.data);
    nextToken = response?.meta?.next_token;
  } while (Boolean(nextToken));

  return allResults;
}
