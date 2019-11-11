import React from 'react';
import { useTasksState, Task } from './TasksState';
import { StateLink, useStateLink } from '@hookstate/core';
import { useSettingsState } from './SettingsState';

function TaskEditor(props: { task: StateLink<Task>, onDelete: () => void }) {
    // The next hook is *global state* link of the global state wrapped by an interface. 
    // In the case of large scale arrays,
    // it would be more efficient if settings were obtained by the parent
    // component once and passed here as a property.
    // We do not care about this optimization in the sample application,
    // and acccess the settings state in every child
    const settingsState = useSettingsState()

    // The next hook is *scoped state* link of a fragment of the global state. 
    // Scoped state is an optional optimisation,
    // we could use 'props.task' everywhere instead of taskState.
    //     See https://github.com/avkonst/hookstate#usestatelink
    //     for more details about the *scoped state*.
    let taskState = useStateLink(props.task);
    if (!settingsState.isScopedUpdateEnabled) {
        // For demonstration purposes, we allow to opt out of
        // the *scoped state* optimisation, if it is disabled:
        // (scope state is still created, but not used in this case)
        taskState = props.task;
    }
    // State link to access and mutate the global state:
    const taskNameGlobal = taskState.nested.name;

    // The next hook is *local state* link with the initial state equal
    // to the copy of the state value, which was supplied in properties. 
    // State link to access and mutate a COPY of the global state:
    const taskNameLocal = useStateLink(taskState.nested.name.get());

    // The next hook is *local state* link with the initial state
    // created from a constant
    const isEditing = useStateLink(false)

    // This is the trick to obtain different color on every run of this function
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
                borderWidth: settingsState.isEditableInline || isEditing.get() ? 1 : 0,
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
                    readOnly={!(settingsState.isEditableInline || isEditing.get())}
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
            <div>{isEditing.get()
                ? <Button
                    style={{
                        marginLeft: 20
                    }}
                    borderColor="grey"
                    onClick={() => {
                        taskNameGlobal.set(taskNameLocal.get())
                        isEditing.set(false)
                    }}
                    text="Save"
                />
                : <Button
                    style={{
                        marginLeft: 20
                    }}
                    borderColor="grey"
                    onClick={() => isEditing.set(true)}
                    text="Edit"
                />
            }</div>
        }
        <div>{isEditing.get()
            ? <Button
                style={{ marginLeft: 15 }}
                borderColor="red"
                onClick={() => {
                    isEditing.set(false)
                    taskNameLocal.set(taskNameGlobal.get())
                }}
                text="Cancel"
            />
            : <Button
                style={{ marginLeft: 15 }}
                borderColor="red"
                onClick={() => {
                    isEditing.set(false)
                    props.onDelete()
                }}
                text="Delete"
            />
        }</div>
    </div>
}

export function TasksViewer() {
    const tasksState = useTasksState()
    const isLoading = useStateLink(true)
    
    // Emulate asynchronous loading of the initial state data.
    // The real application would run some fetch request,
    // to get the initial data from a server.
    React.useEffect(() => {
        const timer = setTimeout(() => {
            tasksState.set([{
                id: '1',
                name: 'Discover Hookstate',
                done: true,
            }, {
                id: '2',
                name: 'Replace Redux by Hookstate',
                done: false,
            }, {
                id: '3',
                name: 'Enjoy simpler code and faster application',
                done: false,
            }])
            isLoading.set(false)
        }, 3000);
        return () => clearTimeout(timer)
        // Eslint for React hooks does not know that
        // state link variable never get's stale
        // (this is the feature of the Hookstate done on purpose),
        // and so warns about it. We disable this warning.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // We want to run this effect only once to emulate the initial loading,
        
    
    if (isLoading.get()) {
        return <div style={{ textAlign: 'center' }}>
            Loading initial state asynchronously...
        </div>
    }
    
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
