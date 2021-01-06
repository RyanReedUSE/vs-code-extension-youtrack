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
  vscode.commands.registerCommand('currentIssues.configureSettings', () =>
    vscode.commands.executeCommand(`workbench.action.openSettings`, `youtrack`)
  );
}
