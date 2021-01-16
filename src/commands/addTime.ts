import * as vscode from 'vscode';
import { addTimeSpent } from '../data/addTimeSpent';
import { Issue } from '../Issue';

export const addTimeCommand = (context: vscode.ExtensionContext) => {
  // Register Current Issues Add Time
  vscode.commands.registerCommand('youtrack.addTime', (node: Issue) => {
    addTimeSpent(context, node.id);
  });
};
