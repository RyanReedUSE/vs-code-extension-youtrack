import * as vscode from 'vscode';
import { addSpentTime } from '../data/addSpentTime';
import { Issue } from '../Issue';

/**
 * addSpentTimeCommand - Registers Add Spent Time Command
 *
 * @param context
 */
export const addSpentTimeCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.addTime', (node: Issue) => {
    addSpentTime(context, node.id);
  });
};
