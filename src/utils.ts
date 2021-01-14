import * as vscode from 'vscode';

/**
 * openUrl - Opens a URL with the youtrack host provided by the extensions settings
 *
 * @param {string} path
 */
export const openUrl = async (path: string) => {
  if (path.includes('admin/hub')) {
    vscode.commands.executeCommand(
      'vscode.open',
      vscode.Uri.parse(`${vscode.workspace.getConfiguration('youtrack').get('host')}/${path}`)
    );
  }
};
