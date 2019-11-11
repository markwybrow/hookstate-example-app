import { createStateLink, useStateLink } from '@hookstate/core';

export interface Task {
    id: string;
    name: string;
    done: boolean;
}

const state = createStateLink<Task[]>([{
    id: "0",
    name: 'initial task',
    done: false
}])

export function useTasksState() {
    return useStateLink(state)
}