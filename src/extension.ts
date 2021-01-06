'use strict';

import * as vscode from 'vscode';

import { DepNodeProvider, Dependency } from './nodeDependencies';

export function activate(context: vscode.ExtensionContext) {
  // Current Issues `window.registerTreeDataProvider`
  const nodeDependenciesProvider = new DepNodeProvider(vscode.workspace.rootPath);
  vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
  vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());

  vscode.commands.registerCommand('nodeDependencies.addEntry', () =>
    vscode.window.showInformationMessage(`Successfully called add entry.`)
  );
  vscode.commands.registerCommand('nodeDependencies.editEntry', (node: Dependency) =>
    vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`)
  );

  /* 
	TODO: Rename all of the functions from nodeDependencies to the current issues list
	TODO: Build the first list of issues by name that match the current filter. 
	TODO: Add current you track card to the bottom ribbon. 
	*/

  vscode.commands.registerCommand('currentIssues.configureSettings', () =>
    vscode.commands.executeCommand(`workbench.action.openSettings`, `youtrack`)
  );
}
