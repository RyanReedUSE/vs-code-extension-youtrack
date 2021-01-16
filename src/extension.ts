'use strict';
import * as vscode from 'vscode';
import { addTimeCommand } from './commands/addTime';
import { selectSavedSearchesCommand } from './commands/selectSavedSearches';
import { viewIssueCommand } from './commands/viewIssue';
import { viewIssueByIdCommand } from './commands/viewIssueById';
import { currentIssuesProvider } from './currentIssues';
import { Issue } from './Issue';
import { searchIssuesProvider } from './searchIssues';
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
  vscode.commands.registerCommand('youtrack.editIssue', (node: Issue) => {
    vscode.commands.executeCommand(
      'vscode.open',
      vscode.Uri.parse(`${vscode.workspace.getConfiguration('youtrack').get('host')}issue/${node.id}`)
    );
    vscode.window.showInformationMessage(`Opened issue in browser.`);
  });

  // Registers Open Issue by Id Command
  viewIssueByIdCommand(context);

  // Registers View Issue Command
  viewIssueCommand(context);

  // Registers Select Saved Searches Command
  selectSavedSearchesCommand(context);

  // Registers Add Time Command
  addTimeCommand(context);

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
  vscode.commands.registerCommand('youtrack.pin', async (node: Issue) => {
    // Set Pinned Issue to Global Storage
    context.globalState.update('youtrackPinIssueId', node.id);
    context.globalState.update('youtrackPinIssueSummary', node.summary);
    // Update Status Bar With Issue
    await updateStatusBarItem(node.id, node.summary);
    // Refresh the Current and Search Issue List to Update the Pin Icon
    _currentIssuesProvider.refresh();
    _searchIssuesProvider.refresh();
  });

  //Register Current Item Unpin
  vscode.commands.registerCommand('youtrack.unpin', async (node: Issue) => {
    // Clear Pinned Issue From Global Storage
    context.globalState.update('youtrackPinIssueId', '');
    context.globalState.update('youtrackPinIssueSummary', '');
    // Clear Status Bar
    await updateStatusBarItem();
    // Refresh the Current and Search Issue List to Update the Pin Icon
    _currentIssuesProvider.refresh();
    _searchIssuesProvider.refresh();
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
