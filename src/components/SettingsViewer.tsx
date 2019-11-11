import React from 'react';
import { useSettingsState } from './SettingsState';

export function SettingsViewer() {
    const settingsState = useSettingsState();
    return <div style={{
        border: 'solid',
        borderWidth: 1,
        borderColor: '#09d3ac',
        marginBottom: 30
    }}>
        <div style={{
            paddingTop: 10,
            paddingLeft: 20,
            paddingBottom: 10
        }}>Settings:</div>
        <div
            style={{
                flexGrow: 2,
                display: 'flex',
            }}
        >
            <div>
                <input
                    style={{ transform: 'scale(2)', margin: 20 }}
                    type="checkbox"
                    checked={settingsState.isEditableInline}
                    onChange={() => settingsState.toogleEditableInline()}
                />
            </div>
            <div
                style={{
                    paddingLeft: 10,
                    paddingBottom: 10
                }}
            >
                allow editing inline
            </div>
        </div>
        <div
            style={{
                flexGrow: 2,
                display: 'flex'
            }}
        >
            <div>
                <input
                    style={{ transform: 'scale(2)', margin: 20 }}
                    type="checkbox"
                    checked={settingsState.isScopedUpdateEnabled}
                    onChange={() => settingsState.toogleScopedUpdate()}
                />
            </div>
            <div
                style={{
                    paddingLeft: 10,
                    paddingBottom: 10
                }}
            >
                enable scoped state link
            </div>
        </div>
        <div
            style={{
                flexGrow: 2,
                display: 'flex'
            }}
        >
            <div>
                <input
                    style={{ transform: 'scale(2)', margin: 20 }}
                    type="checkbox"
                    checked={settingsState.isHighlightUpdateEnabled}
                    onChange={() => settingsState.toogleHighlightUpdate()}
                />
            </div>
            <div
                style={{
                    paddingLeft: 10,
                    paddingBottom: 10
                }}
            >
                enable highlight update marker
            </div>
        </div>
    </div>
}