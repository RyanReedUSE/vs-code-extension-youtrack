import * as vscode from 'vscode';
import { searchIssuesProvider } from '../searchIssues';

/**
 * refreshSearchIssuesCommand - Registers Refresh Search Issues
 *
 * @param context
 */
export const refreshSearchIssuesCommand = (context: vscode.ExtensionContext, provider: searchIssuesProvider) => {
  vscode.commands.registerCommand('youtrack.searchIssues.refresh', () => provider.refresh());
};
