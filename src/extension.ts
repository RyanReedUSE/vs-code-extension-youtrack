'use strict';
import * as vscode from 'vscode';
import { currentIssuesProvider, Issue } from './currentIssues';

let currentIssueStatusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  // Register Current Issues Provider `window.registerTreeDataProvider`
  const _currentIssuesProvider = new currentIssuesProvider(context);
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

  // register a content provider for the cowsay-scheme
  const myScheme = 'cowsay';
  const myProvider = new (class implements vscode.TextDocumentContentProvider {
    // emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): string {
      // simply invoke cowsay, use uri-path as text
      return 'hello world';
    }
  })();
  context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider));

  // Register Current Issues View
  vscode.commands.registerCommand('currentIssues.view', async (node: Issue) => {
    await vscode.window.showTextDocument(
      await vscode.workspace.openTextDocument({ language: 'markdown', content: '### Hello' }),
      { preview: true }
    );
    vscode.commands.executeCommand(`markdown.showPreview`);
    vscode.window.showInformationMessage(`Successfully called view issue on ${node.id}.`);
  });

  // Register Current Issues Pin
  const openPinnedIssue = 'currentIssues.openPinnedIssue';

  // Register Current Issues View
  vscode.commands.registerCommand(openPinnedIssue, () => {
    vscode.window.showInformationMessage(
      `Successfully called view issue on ${context.globalState.get('youtrackPinIssueId')}.`
    );
  });

  // Create Status Bar Item
  currentIssueStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  currentIssueStatusBar.command = openPinnedIssue;
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
  vscode.commands.registerCommand('currentIssues.pin', (node: Issue) => {
    // Set Pinned Issue to Global Storage
    context.globalState.update('youtrackPinIssueId', node.id);
    context.globalState.update('youtrackPinIssueSummary', node.summary);
    // Update Status Bar With Issue
    updateStatusBarItem(node.id, node.summary);
  });

  //Register Current Item Unpin
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
 * @param {id} optional: string
 * @param {summary} optional: string
 */
function updateStatusBarItem(id?: string, summary?: string): void {
  if (id) {
    currentIssueStatusBar.text = `$(tasklist) ${id} ${summary.substring(0, 20)}`;
    currentIssueStatusBar.tooltip = summary;
    currentIssueStatusBar.show();
  } else {
    currentIssueStatusBar.hide();
  }
}
