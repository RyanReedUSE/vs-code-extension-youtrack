'use strict';
import * as vscode from 'vscode';
import {
  addIssueCommand,
  addSpentTimeCommand,
  configureSettingsCommand,
  editIssueCommand,
  pinIssueCommand,
  refreshCurrentIssuesCommand,
  refreshSearchIssuesCommand,
  selectSavedSearchesCommand,
  unpinIssueCommand,
  viewIssueByIdCommand,
  viewIssueCommand,
} from './commands/index';
import { currentIssuesProvider } from './currentIssues';
import { Issue } from './Issue';
import { searchIssuesProvider } from './searchIssues';

let currentIssueStatusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // Register Current Issues Provider `window.registerTreeDataProvider`
  const _currentIssuesProvider = new currentIssuesProvider(context);
  vscode.window.registerTreeDataProvider('currentIssues', _currentIssuesProvider);

  // Registers Refresh Current Issues Command
  refreshCurrentIssuesCommand(context, _currentIssuesProvider);

  // Register Search Issues Provider `window.registerTreeDataProvider`
  const _searchIssuesProvider = new searchIssuesProvider(context);
  _searchIssuesProvider.refresh();
  vscode.window.createTreeView('searchIssues', { treeDataProvider: _searchIssuesProvider, showCollapseAll: true });

  // Registers Refresh Search Issues Command
  refreshSearchIssuesCommand(context, _searchIssuesProvider);

  // Registers YouTrack Configure Settings Command
  configureSettingsCommand(context);

  // Registers Add Issue Command
  addIssueCommand(context);

  // Registers Edit Issue Command
  editIssueCommand(context);

  // Registers Open Issue by Id Command
  viewIssueByIdCommand(context);

  // Registers View Issue Command
  viewIssueCommand(context);

  // Registers Select Saved Searches Command
  selectSavedSearchesCommand(context);

  // Registers Add Spent Time Command
  addSpentTimeCommand(context);

  // Create Status Bar Item and Push to Subscription
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

  // Registers Pin Issue Command
  pinIssueCommand(context);

  //Register Unpin Issue Command
  unpinIssueCommand(context);
}

/**
 * updateStatusBarItem - Update Status Bar With The Current Pinned Task
 *
 * @param {id} optional: string
 * @param {summary} optional: string
 */
export const updateStatusBarItem = async (id?: string, summary?: string): Promise<void> => {
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
};
