import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import { IIssue } from './model';
import Issue from './issue';

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: IIssue;
  }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(<Issue vscode={vscode} initialData={window.initialData} />, document.getElementById('root'));
