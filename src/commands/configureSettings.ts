import * as vscode from 'vscode';

/**
 * configureSettingsCommand - Registers YouTrack Configure Settings Command
 *
 * @param context
 */
export const configureSettingsCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.configureSettings', () =>
    vscode.commands.executeCommand(`workbench.action.openSettings`, `youtrack`)
  );
};
