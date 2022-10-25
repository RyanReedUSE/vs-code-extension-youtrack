import * as vscode from 'vscode';
import { Issue } from '../Issue';
import { ViewIssuePanel } from '../view/ViewIssuePanel';

/**
 * viewIssueCommand - Registers View Issue Command
 *
 * @param context
 */
export const viewIssueCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.viewIssue', async (node?: Issue, issueId?: string) => {
    const selectedIssueId = node?.id || issueId;
    ViewIssuePanel.kill();
    ViewIssuePanel.createOrShow(context.extensionUri, selectedIssueId);
  });
};
