import axios from 'axios';
import * as vscode from 'vscode';

/**
 * fetchIssueData - Fetches issue data for a given issueId
 *
 * @param {string} issueId
 */
export const fetchIssueData = async (issueId: string): Promise<any> => {
  // Get YouTrack Extension Settings
  const host = vscode.workspace.getConfiguration('youtrack').get('host');
  const permanentToken = vscode.workspace.getConfiguration('youtrack').get('permanentToken');

  // Validate that the user has all required settings
  if (!host) {
    vscode.window.showErrorMessage('YouTrack: Missing host setting. Please configure extension settings.');
    return undefined;
  }
  if (!permanentToken) {
    vscode.window.showErrorMessage('YouTrack: Missing token. Please configure extension settings.');
    return undefined;
  }

  const config = {
    headers: { Authorization: `Bearer ${permanentToken}` },
  };

  const issues = await axios
    .get(
      `${host}api/issues/${issueId}?fields=idReadable,summary,resolved,created,updated,numberInProject,project(shortName,name),description,reporter(login,fullName,email,avatarUrl),updater(login,fullName,email,avatarUrl),votes,comments(text,usesMarkdown,created,updated,author(login,fullName)),commentsCount,tags(color(background,foreground),name),links(direction,linkType,issues(idReadable,summary)),attachments(name,url),usesMarkdown,customFields(name,value(id,name,login,fullName,presentation,minutes))`,
      config
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return undefined;
    });

  return issues;
};
