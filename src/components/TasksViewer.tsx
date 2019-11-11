import React from 'react';
import { useTasksState, Task } from './TasksState';
import { StateLink, useStateLink } from '@hookstate/core';
import { useSettingsState } from './SettingsState';

function Button(props: {
    onClick?: () => void,
    borderColor?: string,
    text: string,
    style?: React.CSSProperties
}) {
    return <button
        style={{
            fontSize: '1em',
            border: 'solid',
            borderWidth: 1,
            borderColor: props.borderColor || 'grey',
            color: 'white',
            background: 'none',
            padding: 10,
            minWidth: 110,
            ...props.style
        }}
        onClick={() => props.onClick && props.onClick()}
    >{props.text}</button>
}

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
    // For the direct inline editing, we use *scoped state* link,
    // if it is enabled in app settings.
    // See https://github.com/avkonst/hookstate#usestatelink
    // for more details about scoped state.
    // Scoped state is optional optimisation,
    // we could use 'props.task' everywhere instead of taskState:
    let taskState = useStateLink(props.task);
    if (!settingsState.isScopedUpdateEnabled) {
        // For demonstration purposes, we allow to opt out of the scope
        // state optimisation if it is disabled:
        taskState = props.task;
    }
    // State link to access and mutate the global state directly:
    const taskNameGlobal = taskState.nested.name;
    // State link to access and mutate the COPY of the global state:
    const taskNameLocal = useStateLink(taskState.nested.name.get().toString());

    const [isEditing, setEditing] = React.useState(false)

    var colors = ['#ff0000', '#00ff00', '#0000ff'];
    const color = React.useRef(0)
    color.current += 1
    var nextColor = colors[color.current % colors.length];
    
    return <div
        style={{
            display: 'flex',
            marginBottom: 10,
        }}
    >
        {settingsState.isHighlightUpdateEnabled &&
            <div
                style={{
                    width: 10,
                    marginRight: 15,
                    backgroundColor: nextColor
                }}
            />
        }
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
                    checked={taskState.nested.done.get()}
                    onChange={() => taskState.nested.done.set(p => !p)}
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
                        textDecoration: taskState.nested.done.get() ? 'line-through' : 'none',
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
            <div>{isEditing
                ? <Button
                    style={{
                        marginLeft: 20
                    }}
                    borderColor="grey"
                    onClick={() => {
                        taskNameGlobal.set(taskNameLocal.get())
                        setEditing(false)
                    }}
                    text="Save"
                />
                : <Button
                    style={{
                        marginLeft: 20
                    }}
                    borderColor="grey"
                    onClick={() => setEditing(true)}
                    text="Edit"
                />
            }</div>
        }
        <div>{isEditing
            ? <Button
                style={{ marginLeft: 15 }}
                borderColor="red"
                onClick={() => {
                    setEditing(false)
                    taskNameLocal.set(taskNameGlobal.get().toString())
                }}
                text="Cancel"
            />
            : <Button
                style={{ marginLeft: 15 }}
                borderColor="red"
                onClick={() => {
                    setEditing(false)
                    props.onDelete()
                }}
                text="Delete"
            />
        }</div>
    </div>
}

export function TasksViewer() {
    const tasksState = useTasksState()
    
    return <div style={{ textAlign: 'left', marginBottom: 50 }}>{
        tasksState.nested.map((task, i) => <TaskEditor
            key={task.value.id}
            task={task}
            onDelete={() => tasksState.set(p => {
                // alternatively could use Mutate plugin:
                // https://hookstate.netlify.com/plugin-mutate
                p.splice(i, 1)
                return p;
            })}
        />)
    }
    <div style={{ textAlign: 'right' }} >
        <Button
            style={{ marginTop: 20, minWidth: 300 }}
            borderColor="lightgreen"
            onClick={() => tasksState.set(p => {
                // alternatively could use Mutate plugin:
                // https://hookstate.netlify.com/plugin-mutate
                p.push({
                    id: Math.random().toString() + p.length,
                    name: 'Untitled Task #' + (p.length + 1),
                    done: false
                })
                return p;
            })}
            text="Add new task"
        />
    </div>
    </div>
}
