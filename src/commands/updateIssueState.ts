import * as vscode from 'vscode';
import { updateIssueState } from '../data/updateIssueState';
import { Issue } from '../Issue';

/**
 * updateIssueStateCommand - Registers Update Issue State Command
 *
 * @param context
 */
export const updateIssueStateCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.updateIssueState', (node: Issue) => {
    updateIssueState(node.id);
  });
};
