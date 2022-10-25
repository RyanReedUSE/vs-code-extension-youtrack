import * as vscode from 'vscode';
import { Issue } from '../Issue';

/**
 * editIssueCommand - Registers Edit Issue Command
 *
 * @param context
 */
export const editIssueCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.editIssue', async (node?: Issue) => {
    const host = vscode.workspace.getConfiguration('youtrack').get('host');
    editIssue(node.id);
  });
};

/**
 * editIssue - executes a vs code open handler to display the issue in a browser
 *
 * @param issueId
 */
export const editIssue = (issueId: string) => {
  const host = vscode.workspace.getConfiguration('youtrack').get('host');
  vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${host}issue/${issueId}`));
  vscode.window.showInformationMessage(`Opened issue in browser.`);
};
