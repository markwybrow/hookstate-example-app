import React from 'react';
import { useTasksState } from './TasksState';
import { useSettingsState } from './SettingsState';

export function TasksTotal() {
    const tasksState = useTasksState();
    const settingsState = useSettingsState();
    
    var colors = ['#ff0000', '#00ff00', '#0000ff'];
    const color = React.useRef(0)
    color.current += 1
    var nextColor = colors[color.current % colors.length];
    
    return <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        marginBottom: 30
    }}>
        {settingsState.isHighlightUpdateEnabled &&
            <div
                style={{
                    width: 10,
                    marginRight: 15,
                    backgroundColor: nextColor
                }}
            />
        }
        <div  style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            flexGrow: 2
        }}>
            <div>Total tasks: {tasksState.value.length}</div>
            <div>Done: {tasksState.value.filter(i=> i.done).length}</div>
            <div>Remaining: {tasksState.value.filter(i=> !i.done).length}</div>
        </div>
    </div>
}