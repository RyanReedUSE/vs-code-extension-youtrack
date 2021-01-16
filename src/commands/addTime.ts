import * as vscode from 'vscode';
import { addTimeSpent } from '../data/addTimeSpent';
import { Issue } from '../Issue';

/**
 * addTimeCommand - Registers Add Time Command
 *
 * @param context
 */
export const addTimeCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.addTime', (node: Issue) => {
    addTimeSpent(context, node.id);
  });
};
