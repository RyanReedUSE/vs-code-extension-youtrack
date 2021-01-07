'use strict';

import * as vscode from 'vscode';

import { currentIssuesProvider, Issue } from './currentIssues';

export function activate(context: vscode.ExtensionContext) {
  // Register Current Issues Provider `window.registerTreeDataProvider`
  const _currentIssuesProvider = new currentIssuesProvider();
  vscode.window.registerTreeDataProvider('currentIssues', _currentIssuesProvider);
  // Register Current Issues Refresh
  vscode.commands.registerCommand('currentIssues.refresh', () => _currentIssuesProvider.refresh());
  // Register Current Issues Add Issue
  vscode.commands.registerCommand('currentIssues.addIssue', () => {
    vscode.commands.executeCommand(
      'vscode.open',
      vscode.Uri.parse(`${vscode.workspace.getConfiguration('youtrack').get('host')}newIssue`)
    );
    vscode.window.showInformationMessage(`Successfully called add issue.`);
  });
  // Register Current Issues View
  vscode.commands.registerCommand('currentIssues.view', (node: Issue) =>
    vscode.window.showInformationMessage(`Successfully called view issue on ${node.label}.`)
  );
  // Register Current Issues Configure Settings
  vscode.commands.registerCommand('currentIssues.configureSettings', () =>
    vscode.commands.executeCommand(`workbench.action.openSettings`, `youtrack`)
  );
  /* 
	TODO: Rename all of the functions from nodeDependencies to the current issues list
	TODO: Build the first list of issues by name that match the current filter. 
	TODO: Add current you track card to the bottom ribbon if the branch contains the Id. 
	*/
}
