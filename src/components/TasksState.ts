import { createStateLink, useStateLink } from '@hookstate/core';

export interface Task {
    name: string;
    done: boolean;
}

const state = createStateLink<Task[]>([{
    name: 'initial task',
    done: false
}])

export function useTasksState() {
    return useStateLink(state)
}