import { useQuery } from "@tanstack/react-query";
import { todoListApi } from "./api";

type Todo = {
    id: string,
    text: string,
    done: boolean
}

export function TodoList() {
    const { data, error, isPending } = useQuery({
        queryKey: ['tasks', 'list'],
        queryFn: todoListApi.getToDoList,
        staleTime: 1000 * 60, 
    });


    if(isPending) {
        return <div>Loading...</div>;
    }
    if(error) {
        return <div>Error loading tasks: {error.message}</div>;
    }
  return (
    <div>
      <h1>Todo List</h1>
      {data.map(todo => <div key={todo.id}>{todo.text}</div>)}
    </div>
  );
}