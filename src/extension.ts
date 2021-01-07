'use strict';
import * as vscode from 'vscode';
import { currentIssuesProvider, Issue } from './currentIssues';

let currentIssueStatusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // Register Current Issues Provider `window.registerTreeDataProvider`
  const _currentIssuesProvider = new currentIssuesProvider();
  vscode.window.registerTreeDataProvider('currentIssues', _currentIssuesProvider);

  // Register Current Issues Configure Settings
  vscode.commands.registerCommand('currentIssues.configureSettings', () =>
    vscode.commands.executeCommand(`workbench.action.openSettings`, `youtrack`)
  );

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

  // Register Current Issues Pin
  const openPinnedIssue = 'currentIssues.openPinnedIssue';
  // Register Current Issues View
  vscode.commands.registerCommand(openPinnedIssue, () => {
    vscode.window.showInformationMessage(
      `Successfully called view issue on ${context.globalState.get('youtrackPinIssueId')}.`
    );
  });
  currentIssueStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  currentIssueStatusBar.command = openPinnedIssue;
  context.subscriptions.push(currentIssueStatusBar);

  vscode.commands.registerCommand('currentIssues.pin', (node: Issue) => {
    // Set Pinned Issue to Global Storage
    context.globalState.update('youtrackPinIssueId', node.label);
    context.globalState.update('youtrackPinIssueSummary', node.summary);
    // Update Status Bar With Issue
    updateStatusBarItem(node);
  });

  vscode.commands.registerCommand('currentIssues.unpin', (node: Issue) => {
    // Clear Pinned Issue From Global Storage
    context.globalState.update('youtrackPinIssueId', '');
    context.globalState.update('youtrackPinIssueSummary', '');
    // Clear Status Bar
    updateStatusBarItem();
  });
}

/**
 * Update Status Bar With The Current Pinned Task
 *
 * @param {Issue} issue
 */
function updateStatusBarItem(issue?: Issue): void {
  if (issue) {
    currentIssueStatusBar.text = `$(tasklist) ${issue.label} ${issue.summary.substring(0, 20)}`;
    currentIssueStatusBar.show();
  } else {
    currentIssueStatusBar.hide();
  }
}
