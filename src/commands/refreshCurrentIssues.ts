import * as vscode from 'vscode';
import { currentIssuesProvider } from '../currentIssues';

/**
 * refreshCurrentIssuesCommand - Registers Refresh Current Issues
 *
 * @param context
 */
export const refreshCurrentIssuesCommand = (context: vscode.ExtensionContext, provider: currentIssuesProvider) => {
  vscode.commands.registerCommand('youtrack.currentIssues.refresh', () => provider.refresh());
};
