import * as vscode from 'vscode';

/**
 * addIssueCommand - Registers Add Issue Command
 *
 * @param context
 */
export const addIssueCommand = (context: vscode.ExtensionContext) => {
  const host = vscode.workspace.getConfiguration('youtrack').get('host');

  vscode.commands.registerCommand('youtrack.addIssue', () => {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${host}newIssue`));
  });
};
