'use strict';
import * as vscode from 'vscode';
import { currentIssuesProvider } from './currentIssues';
import { searchIssuesProvider } from './searchIssues';
import { Issue } from './Issue';
import { ViewIssuePanel } from './view/ViewIssuePanel';

let currentIssueStatusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // Register Current Issues Provider `window.registerTreeDataProvider`
  const _currentIssuesProvider = new currentIssuesProvider(context);
  vscode.window.registerTreeDataProvider('currentIssues', _currentIssuesProvider);

  // Register Current Issues Refresh
  vscode.commands.registerCommand('youtrack.currentIssues.refresh', () => _currentIssuesProvider.refresh());

  // Register Search Issues Provider `window.registerTreeDataProvider`
  const _searchIssuesProvider = new searchIssuesProvider(context);
  _searchIssuesProvider.refresh();
  vscode.window.createTreeView('searchIssues', { treeDataProvider: _searchIssuesProvider, showCollapseAll: true });

  // Register workspace Issues Refresh
  vscode.commands.registerCommand('youtrack.searchIssues.refresh', () => _searchIssuesProvider.refresh());

  // Register Search Issues Configure Settings
  vscode.commands.registerCommand('youtrack.configureSettings', () =>
    vscode.commands.executeCommand(`workbench.action.openSettings`, `youtrack`)
  );

  // Register Current Issues Add Issue
  vscode.commands.registerCommand('youtrack.addIssue', () => {
    vscode.commands.executeCommand(
      'vscode.open',
      vscode.Uri.parse(`${vscode.workspace.getConfiguration('youtrack').get('host')}newIssue`)
    );
  });

  // Register Current Issues Add Issue
  vscode.commands.registerCommand('youtrack.currentIssues.editIssue', (node: Issue) => {
    vscode.commands.executeCommand(
      'vscode.open',
      vscode.Uri.parse(`${vscode.workspace.getConfiguration('youtrack').get('host')}issue/${node.id}`)
    );
    vscode.window.showInformationMessage(`Opened issue in browser.`);
  });

  // Register Open Issue by Id
  vscode.commands.registerCommand('youtrack.openIssueById', async () => {
    const result = await vscode.window.showInputBox({
      placeHolder: 'Enter YouTrack Issue Id (For example: YT-123)',
    });
    vscode.commands.executeCommand('youtrack.viewIssue', undefined, result);
  });

  // Register Current Issues View
  vscode.commands.registerCommand('youtrack.viewIssue', async (node?: Issue, issueId?: string) => {
    const selectedIssueId = node?.id || issueId;
    ViewIssuePanel.kill();
    ViewIssuePanel.createOrShow(context.extensionUri, selectedIssueId);
  });

  // Create Status Bar Item
  currentIssueStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  context.subscriptions.push(currentIssueStatusBar);

  // Check If Global State Already Has a Pinned Issue
  if (context.globalState.get('youtrackPinIssueId')) {
    // Get Pinned Issue to Global Storage
    const id = context.globalState.get('youtrackPinIssueId') as string;
    const summary = context.globalState.get('youtrackPinIssueSummary') as string;
    // Update Status Bar With Issue
    updateStatusBarItem(id, summary);
  }

  // Register Current Item Pin
  vscode.commands.registerCommand('youtrack.currentIssues.pin', async (node: Issue) => {
    // Set Pinned Issue to Global Storage
    context.globalState.update('youtrackPinIssueId', node.id);
    context.globalState.update('youtrackPinIssueSummary', node.summary);
    // Update Status Bar With Issue
    await updateStatusBarItem(node.id, node.summary);
    // Refresh the Current Issue List to Update the Pin Icon
    _currentIssuesProvider.refresh();
  });

  //Register Current Item Unpin
  vscode.commands.registerCommand('youtrack.currentIssues.unpin', async (node: Issue) => {
    // Clear Pinned Issue From Global Storage
    context.globalState.update('youtrackPinIssueId', '');
    context.globalState.update('youtrackPinIssueSummary', '');
    // Clear Status Bar
    await updateStatusBarItem();
    // Refresh the Current Issue List to Update the Pin Icon
    _currentIssuesProvider.refresh();
  });

  // Register Current Issues Add Time
  vscode.commands.registerCommand('youtrack.currentIssues.addTime', (node: Issue) => {
    vscode.window.showInformationMessage(`TODO: Implement Add Time to Given Card Feature. ${node.id}`);
  });
}

/**
 * Update Status Bar With The Current Pinned Task
 *
 * @param {id} optional: string
 * @param {summary} optional: string
 */
async function updateStatusBarItem(id?: string, summary?: string): Promise<void> {
  if (id) {
    currentIssueStatusBar.text = `$(tasklist) ${id} ${summary?.substring(0, 20)}`;
    currentIssueStatusBar.tooltip = summary;
    currentIssueStatusBar.command = {
      command: 'youtrack.viewIssue',
      title: '',
      arguments: [undefined, id],
    };
    currentIssueStatusBar.show();
  } else {
    currentIssueStatusBar.hide();
  }
}
