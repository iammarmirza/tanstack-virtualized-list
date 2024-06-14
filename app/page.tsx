"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useRef, useEffect } from "react";
import { HOST_NAME, MAX_PAGE_SIZE, POSTS_QUERY } from "@/utils/constants";
import { fetchData } from "@/utils/fetchData";

export default function Home() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam }) =>
        fetchData(POSTS_QUERY, {
          host: HOST_NAME,
          pageSize: MAX_PAGE_SIZE,
          page: pageParam as number,
        })(),
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => {
        return lastPage.publication?.postsViaPage.pageInfo.nextPage ?? null;
      },
    });

  const parentRef = useRef(null);
  const posts =
    data?.pages.flatMap((page: any) => page.publication?.postsViaPage.nodes) ||
    [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? posts.length + 1 : posts.length,
    getScrollElement: useCallback(() => parentRef.current, []),
    estimateSize: useCallback(() => 150, []),
    overscan: 2,
    gap: 15,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= posts.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    posts.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div
      ref={parentRef}
      className="w-full flex flex-col overflow-auto h-[500px]"
    >
      <div
        className="relative w-full"
        style={{
          height: rowVirtualizer.getTotalSize(),
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > posts.length - 1;
          const post = posts[virtualRow.index];
          if (!post) return null;
          return (
            <div
              key={virtualRow.index}
              data-index={virtualRow.index}
              className="w-full absolute border"
              ref={rowVirtualizer.measureElement}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="flex flex-col gap-3">
                <p className="font-bold">{post.title}</p>
                <p>{post.brief}</p>
              </div>
              {isLoaderRow && hasNextPage && "Loading..."}
            </div>
          );
        })}
      </div>
    </div>
  );
}
