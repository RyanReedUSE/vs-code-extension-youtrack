import * as vscode from 'vscode';
import axios from 'axios';

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
      `${host}api/issues/${issueId}?fields=idReadable,summary,resolved,created,updated,numberInProject,project(shortName,name),description,reporter(login,fullName,email,avatarUrl),updater(login,fullName,email,avatarUrl),votes,comments(text,created,updated,author(login,fullName)),commentsCount,tags(color(background,foreground),name),links(direction,linkType,issues(idReadable,summary)),attachments(name,url),usesMarkdown,customFields(name,value(id,name,login,fullName))`,
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

/**
 * createBranch - Creates a branch that defaults to the issue's id and name,
 * but can be overwritten with a user input
 *
 * @param {string} branchName
 */
export const createBranch = async (branchName: string) => {
  const config = vscode.workspace.getConfiguration('git');

  const branchWhitespaceChar = config.get<string>('branchWhitespaceChar')!;
  const branchValidationRegex = config.get<string>('branchValidationRegex')!;
  const sanitize = (name: string) =>
    name
      ? name
          .trim()
          .replace(/^-+/, '')
          .replace(/^\.|\/\.|\.\.|~|\^|:|\/$|\.lock$|\.lock\/|\\|\*|\s|^\s*$|\.$|\[|\]$/g, branchWhitespaceChar)
      : name;

  const result = await vscode.window.showInputBox({
    value: sanitize(branchName).substring(0, 28),
    prompt: "Please provide or confirm a new branch name (Press 'Enter' to confirm)",
    placeHolder: 'Enter YouTrack Issue Id (For example: YT-123)',
    validateInput: (name: string) => {
      const validateName = new RegExp(branchValidationRegex);
      if (validateName.test(sanitize(name))) {
        return null;
      }

      return `branch name format invalid.`;
    },
  });

  // Check if user did not supply a branch name or escaped out.
  if (!result) {
    vscode.window.showInformationMessage('Branch was not created');
    return;
  }

  // Create a new terminal and run a git create branch and check it out.
  const terminal = vscode.window.createTerminal(`YouTrack Git`);
  terminal.sendText(`git checkout -b ${result}`);

  vscode.window.showInformationMessage(`Branch created: ${result}`);
};

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

/**
 * updateIssueStatus
 *
 * @param {string} issueId
 */
export const updateIssueStatus = async (issueId: string) => {
  // TODO: Fetch a list of Statuses from the issues project and present them as a list to the user.

  // TODO: Ask the user to select a status, update the issue in youtrack.

  vscode.window.showInformationMessage(`NOT IMPLEMENTED update status ${issueId}`);
};
