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

ReactDOM.render(<Issue vscode={vscode} issueData={window.issueData} />, document.getElementById('root'));
