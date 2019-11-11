import { createStateLink, useStateLink, useStateLinkUnmounted } from '@hookstate/core';

export interface Task {
    id: string;
    name: string;
    done: boolean;
}

const state = createStateLink<Task[]>([])

export function useTasksState() {
    // This function exposes the state directly.
    // i.e. the state link is accessible directly outside of this module.
    // The state for settings in SettingsState.ts wraps the state by an interface.
    // Both options are valid and you need to use one or another,
    // depending on your circumstances. Apply your engineering judgement
    // to choose the best option. If unsure, exposing the state directly
    // like it is done below is a safe bet.        
    return useStateLink(state)
}

// for example purposes, let's update the state outside of a React component
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