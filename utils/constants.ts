export const POSTS_QUERY = `query Posts($host: String, $pageSize: Int!, $page: Int!) {
    publication(host: $host) {
      postsViaPage(pageSize: $pageSize, page: $page) {
        nodes {
          id
          slug
          title
          brief
        }
        pageInfo {
          hasNextPage
          nextPage
        }
      }
    }
  }`;

export const HOST_NAME = "engineering.hashnode.com";

export const MAX_PAGE_SIZE = 10;
