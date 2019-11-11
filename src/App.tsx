import React from 'react';
import { TasksViewer } from './components/TasksViewer';
import { SettingsViewer } from './components/SettingsViewer';

const App: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flexGrow: 2 }} />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontSize: 28,
        color: 'white',
      }}>
        <div style={{ minWidth: 400, maxWidth: 800, padding: 20 }}>
          <SettingsViewer />
          <TasksViewer />
          <hr/>
          <a
            style={{ color: '#09d3ac' }}
            href="https://github.com/avkonst/hookstate"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Hookstate
          </a>
          <p style={{ fontSize: '0.7em' }}>
            Turn on 'Highlight Updates'
            in <a style={{ color: '#09d3ac' }} href="https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en">React Development Tools</a> and
            watch what components are updated when you change the application's state.
          </p>
        </div>
      </div>
      <div style={{ flexGrow: 2 }} />
    </div>
  );
}

export default App;
