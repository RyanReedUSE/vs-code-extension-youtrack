'use strict';
import * as vscode from 'vscode';
import { currentIssuesProvider, Issue } from './currentIssues';
import ViewLoader from './view/ViewLoader';

let currentIssueStatusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand('youtrack.viewConfig', () => {
    const openDialogOptions: vscode.OpenDialogOptions = {
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        Json: ['json'],
      },
    };

    vscode.window.showOpenDialog(openDialogOptions).then(async (uri: vscode.Uri[] | undefined) => {
      if (uri && uri.length > 0) {
        const view = new ViewLoader(uri[0], context.extensionPath);
      } else {
        vscode.window.showErrorMessage('No valid file selected!');
        return;
      }
    });
  });

  // Register Current Issues Provider `window.registerTreeDataProvider`
  const _currentIssuesProvider = new currentIssuesProvider(context);
  vscode.window.registerTreeDataProvider('currentIssues', _currentIssuesProvider);
  vscode.workspace.textDocuments;
  // Register Current Issues Configure Settings
  vscode.commands.registerCommand('youtrack.currentIssues.configureSettings', () =>
    vscode.commands.executeCommand(`workbench.action.openSettings`, `youtrack`)
  );

  // Register Current Issues Refresh
  vscode.commands.registerCommand('youtrack.currentIssues.refresh', () => _currentIssuesProvider.refresh());

  // Register Current Issues Add Issue
  vscode.commands.registerCommand('youtrack.currentIssues.addIssue', () => {
    vscode.commands.executeCommand(
      'vscode.open',
      vscode.Uri.parse(`${vscode.workspace.getConfiguration('youtrack').get('host')}newIssue`)
    );
    vscode.window.showInformationMessage(`Successfully called add issue.`);
  });

  // Register Current Issues Add Issue
  vscode.commands.registerCommand('youtrack.currentIssues.editIssue', (node: Issue) => {
    vscode.commands.executeCommand(
      'vscode.open',
      vscode.Uri.parse(`${vscode.workspace.getConfiguration('youtrack').get('host')}issue/${node.id}`)
    );
    vscode.window.showInformationMessage(`Opened issue in browser.`);
  });

  // Register Current Issues View
  vscode.commands.registerCommand('youtrack.currentIssues.view', async (node?: Issue, issueId?: string) => {
    const selectedIssueId = node?.id || issueId;

    await vscode.window.showTextDocument(
      await vscode.workspace.openTextDocument({ language: 'markdown', content: `### Hello ${selectedIssueId}` }),
      { preview: false }
    );
    vscode.commands.executeCommand(`markdown.showPreview`);
    vscode.window.showInformationMessage(`Successfully called view issue on ${selectedIssueId}.`);
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
      command: 'youtrack.currentIssues.view',
      title: '',
      arguments: [undefined, id],
    };
    currentIssueStatusBar.show();
  } else {
    currentIssueStatusBar.hide();
  }
}
