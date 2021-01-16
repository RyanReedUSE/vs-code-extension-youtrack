import * as vscode from 'vscode';
import { Issue } from '../Issue';

/**
 * editIssueCommand - Registers Edit Issue Command
 *
 * @param context
 */
export const editIssueCommand = (context: vscode.ExtensionContext) => {
  const host = vscode.workspace.getConfiguration('youtrack').get('host');

  vscode.commands.registerCommand('youtrack.editIssue', (node: Issue) => {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${host}issue/${node.id}`));
    vscode.window.showInformationMessage(`Opened issue in browser.`);
  });
};
