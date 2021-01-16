import * as vscode from 'vscode';

/**
 * viewIssueByIdCommand - Registers View Issue by Id Command
 *
 * @param context
 */
export const viewIssueByIdCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.viewIssueById', async () => {
    const result = await vscode.window.showInputBox({
      placeHolder: '(For example: YT-123)',
      prompt: 'Enter YouTrack Issue Id',
    });
    vscode.commands.executeCommand('youtrack.viewIssue', undefined, result);
  });
};
