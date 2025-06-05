const BASE_URL = 'http://localhost:3000';

export type PaginatedResult<T> = {
    data: T[]   
    first: number
    items: number
    last: number
    next:number
    pages: number
    prev: number | null,
}

export type TodoDto = {
    id: string,
    text: string,
    done: boolean
};

export const todoListApi = {
    getToDoList: (
        {page}: {page: number}, 
        { signal }: { signal: AbortSignal }
    ) => {
        return fetch(`${BASE_URL}/tasks?_page=${page}&_per_page=10`, { signal })
            .then(response => response.json() as Promise<PaginatedResult<TodoDto[]>>);
    }
};
