import * as vscode from 'vscode';
import axios from 'axios';
import * as moment from 'moment';
import { SpentTime } from './model';

/**
 * Given the YouTrack Extension Settings, returns an array of current issues.
 */
export async function addTimeSpent(context: vscode.ExtensionContext, issueId: string): Promise<any> {
  // TODO: Type
  // Get YouTrack Extension Settings
  const host = vscode.workspace.getConfiguration('youtrack').get('host');
  const permanentToken = vscode.workspace.getConfiguration('youtrack').get('permanentToken');

  // Validate that the user has all required settings
  if (!host) {
    vscode.window.showErrorMessage('YouTrack: Missing host setting. Please configure extension settings.');
    return [];
  }
  if (!permanentToken) {
    vscode.window.showErrorMessage('YouTrack: Missing token. Please configure extension settings.');
    return [];
  }

  const config = {
    headers: { Authorization: `Bearer ${permanentToken}` },
  };

  // Prompt the user to enter their own youtrack query
  const timeSpent: string = await vscode.window.showInputBox({
    prompt: `Enter the time spent for Issue ${issueId}. (1w=5d, 1d=8h)`,
    placeHolder: 'Enter valid duration syntax for time spent (For example: 1w 2d 4h)',
  });

  if (!timeSpent) {
    vscode.window.showWarningMessage('No value was provided for time spent.');
    return;
  }

  const workItem: SpentTime = await axios
    .post(
      `${host}api/issues/${issueId}/timeTracking/workItems?fields=id,$type,duration(minutes,presentation)`,
      {
        duration: {
          $type: 'DurationValue',
          presentation: timeSpent,
        },
        date: moment().valueOf(),
        usesMarkdown: true,
      },
      config
    )
    .then((response) => {
      if (response.data) {
        vscode.window.showInformationMessage(`Time added to issue ${issueId}`);
        return response.data;
      }
    })
    .catch((err) => {
      vscode.window.showErrorMessage(`Issue recording time: ${err.response.data.error_description}`);
      return;
    });

  return workItem;
}
