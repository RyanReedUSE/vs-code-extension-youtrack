import * as vscode from 'vscode';
import axios from 'axios';
import { Issue } from '../Issue';
import * as moment from 'moment';

/**
 * Given the YouTrack Extension Settings, returns an array of current issues.
 */
export async function getCurrentIssues(context: vscode.ExtensionContext): Promise<Issue[]> {
  // Get YouTrack Extension Settings
  const host = vscode.workspace.getConfiguration('youtrack').get('host');
  const permanentToken = vscode.workspace.getConfiguration('youtrack').get('permanentToken');
  const currentIssuesQuery = vscode.workspace.getConfiguration('youtrack').get('currentIssuesQuery');
  const youtrackPinIssueId = context.globalState.get('youtrackPinIssueId') as string;

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

  const issues = await axios
    .get(
      `${host}api/issues?fields=idReadable,summary,resolved,reporter(login,fullName),created,customFields(name,value(id,name,login,fullName))&$top=20&query=${currentIssuesQuery}`,
      config
    )
    .then((response) => {
      if (response.data) {
        const issuesResponse = response.data.map((issue) => {
          return new Issue(
            issue.idReadable,
            issue.idReadable,
            issue.summary,
            issue.reporter.fullName,
            moment(issue.created).format('DD MMM YYYY'),
            vscode.TreeItemCollapsibleState.None,
            {
              command: 'youtrack.currentIssues.view',
              title: '',
              arguments: [undefined, issue.idReadable],
            },
            youtrackPinIssueId
          );
        });
        console.log(issuesResponse);
        return issuesResponse;
      }
    })
    .catch((err) => {
      console.log(err);
      return [];
    });

  return issues;
}
