const BASE_URL = 'http://localhost:3000';


export type TodoDto = {
    id: string,
    text: string,
    done: boolean
}

export const todoListApi = {
    getToDoList: () => {
        return fetch(`${BASE_URL}/tasks`).then(response => response.json() as Promise<TodoDto[]>);
    }
}