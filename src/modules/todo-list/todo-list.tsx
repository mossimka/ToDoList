import { useCallback, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { todoListApi } from "./api";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export function TodoList() {
  const [enabled, setEnabled] = useState(false);

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["tasks", "list"],
    queryFn: ({ pageParam = 1, signal }) =>
      todoListApi.getToDoList({ page: pageParam }, { signal }),
    getNextPageParam: (result) => result.next,
    enabled,
    initialPageParam: 1,
  });

  const cursorRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>Error loading tasks: {error.message}</div>;

  const allTodos = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="p-5 mx-auto max-w-[1200px]">
      <h1 className="text-3xl font-bold underline mb-5">Todo List</h1>
      <button onClick={() => setEnabled((e) => !e)} className="border p-2 mb-5">
        Toggle enabled
      </button>

      <div className={"flex flex-col gap-4 " + (isFetchingNextPage ? "opacity-50" : "")}>
        {allTodos.map((todo) => (
          <div key={todo.id} className="border border-slate-300 rounded p-3 mb-1">
            {todo.text}
          </div>
        ))}
      </div>

      <div ref={cursorRef} className="h-10 mt-4">
        {isFetchingNextPage && <div>Loading more...</div>}
        {!hasNextPage && <div>No more tasks to load</div>}
      </div>
    </div>
  );
}

export function useIntersection(onIntersect: () => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  return useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    if (el) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      });

      observerRef.current.observe(el);
    }
  }, [onIntersect]);
}
