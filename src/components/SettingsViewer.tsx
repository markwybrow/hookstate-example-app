import React from 'react';
import { useSettingsState } from './SettingsState';

export function SettingsViewer() {
    const settingsState = useSettingsState();
    return <>
        <div
            style={{
                flexGrow: 2,
                display: 'flex',
                border: 'solid',
                borderWidth: 1,
                borderColor: '#09d3ac',
                marginBottom: 10,
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
                    paddingTop: 5,
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
                display: 'flex',
                border: 'solid',
                borderWidth: 1,
                borderColor: '#09d3ac',
                marginBottom: 30,
            }}
        >
            <div>
                <input
                    style={{ transform: 'scale(2)', margin: 20 }}
                    type="checkbox"
                    checked={settingsState.isScopedUpdate}
                    onChange={() => settingsState.toogleScopedUpdate()}
                />
            </div>
            <div
                style={{
                    paddingTop: 5,
                    paddingLeft: 10,
                    paddingBottom: 10
                }}
            >
                enable scoped state link
            </div>
        </div>
    </>
}