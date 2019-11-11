import { createStateLink, useStateLink, useStateLinkUnmounted } from '@hookstate/core';

export interface Task {
    id: string;
    name: string;
    done: boolean;
}

const state = createStateLink<Task[]>([])

export function useTasksState() {
    return useStateLink(state)
}

// for example purposes:
setTimeout(() => {
    useStateLinkUnmounted(state).set(p => {
        p.push({
            id: '100',
            name: 'Spread few words about Hookstate',
            done: false
        })
        return p;
    })
}, 10000)