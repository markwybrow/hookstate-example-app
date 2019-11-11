import React from 'react';
import { useTasksState, Task } from './TasksState';
import { StateLink, useStateLink } from '@hookstate/core';
import { useSettingsState } from './SettingsState';


function TaskEditor(props: { task: StateLink<Task>, onDelete: () => void }) {
    // In large scale arrays,
    // it would be a bit more efficient if settings were passed as a property
    // from a parent component, because they are the same for all tasks.
    // We do not care about this little optimization in the sample application.
    const settingsState = useSettingsState()

    // The next two hooks show how the global state can be modified
    // - via a proxy state of a copy data allowing 'Save/Cancel' actions
    // OR
    // - directly allowing inline editing
    //      For the direct inline editing, we use *scoped state* link
    //         (see: https://github.com/avkonst/hookstate#usestatelink)
    //      to make sure the whole list is not rerendered on every keystroke.
    //      Scoped state is optional optimisation,
    //      we could use 'props.task.nested.name' everywhere instead
    //
    // State link to access and mutate the global state directly:
    const taskNameGlobal = useStateLink(props.task.nested.name);
    // State link to access and mutate the COPY of the global state:
    const taskNameLocal = useStateLink(taskNameGlobal.get().toString());

    const [isEditing, setEditing] = React.useState(false)
    
    return <div style={{ display: 'flex', marginBottom: 10 }}>
        <div
            style={{
                flexGrow: 2,
                display: 'flex',
                border: 'solid',
                borderWidth: settingsState.isEditableInline || isEditing ? 1 : 0,
                borderColor: 'grey',
            }}
        >
            <div>
                <input
                    style={{
                        transform: 'scale(2)',
                        margin: 20
                    }}
                    type="checkbox"
                    checked={props.task.nested.done.get()}
                    onChange={() => props.task.nested.done.set(p => !p)}
                />
            </div>
            <div style={{ flexGrow: 2 }}>
                <input
                    style={{
                        fontSize: '1em',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        width: '90%',
                        padding: 10,
                        textDecoration: props.task.nested.done.get() ? 'line-through' : 'none',
                    }}
                    readOnly={!(settingsState.isEditableInline || isEditing)}
                    value={
                        settingsState.isEditableInline
                            ? taskNameGlobal.get()
                            : taskNameLocal.get()
                    }
                    onChange={e => {
                        if (settingsState.isEditableInline) {
                            taskNameGlobal.set(e.target.value)
                        }
                        taskNameLocal.set(e.target.value)
                    }}
                />
            </div>
        </div>
        {!settingsState.isEditableInline &&
            <div>
                <button
                    style={{
                        fontSize: '1em',
                        border: 'solid',
                        borderWidth: 1,
                        borderColor: 'grey',
                        color: 'white',
                        background: 'none',
                        padding: 10,
                        marginLeft: 20,
                        minWidth: 110
                    }}
                    onClick={() => {
                        if (isEditing) {
                            taskNameGlobal.set(taskNameLocal.get())
                        }
                        setEditing(p => !p)
                    }}
                >{isEditing ? 'Save' : 'Edit'}</button>
            </div>
        }
        <div>
            <button
                style={{
                    fontSize: '1em',
                    border: 'solid',
                    borderWidth: 1,
                    borderColor: 'red',
                    color: 'white',
                    background: 'none',
                    padding: 10,
                    marginLeft: 20,
                    minWidth: 110
                }}
                onClick={() => {
                    setEditing(p => !p)
                    isEditing ? taskNameLocal.set(taskNameGlobal.get()) : props.onDelete()
                }}
            >{isEditing ? 'Cancel' : 'Delete'}</button>
        </div>
    </div>
}

export function TasksViewer() {
    const tasksState = useTasksState()
    
    return <div style={{ textAlign: 'left', marginBottom: 50 }}>{
        tasksState.nested.map((task, i) => <TaskEditor
            key={i.toString() + Math.random()}
            task={task}
            onDelete={() => tasksState.set(p => {
                // alternatively could use Mutate plugin:
                // https://hookstate.netlify.com/plugin-mutate
                p.splice(i, 1)
                return p;
            })}
        />)
    }
        <button
            style={{
                fontSize: '1em',
                marginTop: 20,
                border: 'solid',
                borderWidth: 1,
                borderColor: 'green',
                color: 'white',
                background: 'none',
                padding: 10,                
            }}
            onClick={() => tasksState.set(p => {
                // alternatively could use Mutate plugin:
                // https://hookstate.netlify.com/plugin-mutate
                p.push({
                    name: 'Untitled Task #' + (p.length + 1),
                    done: false
                })
                return p;
            })}
        >Add new task</button>
    </div>
}
