import * as React from 'react';
import '../../style/main.css';
import '../../../media/reset.css';
import '../../../media/vscode.css';
import * as ReactDOM from 'react-dom';

import './index.css';
import Issue from './issue';

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    youtrackHost: string;
    issueData: any;
  }
}

const vscode = window.acquireVsCodeApi();

document.addEventListener(
  'click',
  (event) => {
    let node = event && event.target;
    while (node) {
      if (node instanceof HTMLAnchorElement) {
        // Handle click by posting data back to VS Code for extension to handle
        vscode.postMessage({ command: 'link', text: node.getAttribute('href') });
        event.preventDefault();
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node = node.parentNode;
    }
  },
  true
);

ReactDOM.render(
  <Issue vscode={vscode} issueData={window.issueData} host={window.youtrackHost} />,
  document.getElementById('root')
);
