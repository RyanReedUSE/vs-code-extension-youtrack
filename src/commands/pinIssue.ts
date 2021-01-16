import * as vscode from 'vscode';
import { updateStatusBarItem } from '../extension';
import { Issue } from '../Issue';

/**
 * pinIssueCommand - Registers Pin Issue Command
 *
 * @param context
 */
export const pinIssueCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.pin', async (node: Issue) => {
    // Set Pinned Issue to Global Storage
    context.globalState.update('youtrackPinIssueId', node.id);
    context.globalState.update('youtrackPinIssueSummary', node.summary);
    // Update Status Bar With Issue
    await updateStatusBarItem(node.id, node.summary);
    // Refresh the Current and Search Issue List to Update the Pin Icon
    vscode.commands.executeCommand(`youtrack.currentIssues.refresh`);
    vscode.commands.executeCommand(`youtrack.searchIssues.refresh`);
  });
};

/**
 * unpinIssueCommand - Registers Pin Issue Command
 *
 * @param context
 */
export const unpinIssueCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.pin', async (node: Issue) => {
    // Clear Pinned Issue From Global Storage
    context.globalState.update('youtrackPinIssueId', '');
    context.globalState.update('youtrackPinIssueSummary', '');
    // Clear Status Bar
    await updateStatusBarItem();
    // Refresh the Current and Search Issue List to Update the Pin Icon
    vscode.commands.executeCommand(`youtrack.currentIssues.refresh`);
    vscode.commands.executeCommand(`youtrack.searchIssues.refresh`);
  });
};
