import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { todoListApi } from "./api";

type Todo = {
    id: string,
    text: string,
    done: boolean
}

export function TodoList() {
  const [enabled, setEnabled] = useState(false);

    const { data: todoItems, error, isLoading, isPlaceholderData, fetchNextPage, hasNextPage, isfectingNextPage } = useQuery({
        queryKey: ['tasks', 'list'],
        queryFn: (meta) => todoListApi.getToDoList({ page: meta.pageParam }, meta),
        placeholderData: keepPreviousData,
        enabled: enabled,
        initalPageParam: 1,
        getNextPageParam: (result) => result.next,
    });


    if(isLoading) {
        return <div>Loading...</div>;
    }
    if(error) {
        return <div>Error loading tasks: {error.message}</div>;
    }
  return (
    <div className="p-5 mx-auto max-w-[1200px]">
      <h1 className="text-3xl font-bold underline mb-5">Todo List</h1>
      <button
        onClick={() => setEnabled(e => !e)} className="border">Toggle enabled</button>
      <div className={"felx flex-col gap-4" + (isPlaceholderData ? 'opacity-50' : '')}>
        {todoItems?.data.map(todo => 
          <div key={todo.id} className="border border-slate-300 rounded p-3 mb-1">{todo.text}</div>
          )}
      </div>

      <div className="mt-4">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} className="p-3 rounder border border-teal-500">prev</button>
        <button onClick={() => setPage(p => Math.min(p + 1, todoItems?.pages ?? 1))} className="p-3 rounder border border-teal-500">next</button>
      </div>
    </div>
  );
}