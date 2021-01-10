import * as React from 'react';
import '../../style/main.css';
import * as ReactDOM from 'react-dom';

import './index.css';
import Issue from './issue';

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    issueData: any;
  }
}

const vscode = window.acquireVsCodeApi();

console.log('issue data', window.issueData);

ReactDOM.render(<Issue vscode={vscode} initialData={window.issueData} />, document.getElementById('root'));
