import * as vscode from 'vscode';
import axios from 'axios';
import { CustomFieldStatus, IssueProject, IssueProjectCustomFields, Value } from './model';
import { orderBy } from 'lodash';
import { stat } from 'fs';
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
      `${host}api/issues/${issueId}?fields=idReadable,summary,resolved,created,updated,numberInProject,project(shortName,name),description,reporter(login,fullName,email,avatarUrl),updater(login,fullName,email,avatarUrl),votes,comments(text,created,updated,author(login,fullName)),commentsCount,tags(color(background,foreground),name),links(direction,linkType,issues(idReadable,summary)),attachments(name,url),usesMarkdown,customFields(name,value(id,name,login,fullName,presentation,minutes))`,
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

  // Fetch issue details to get project id.
  const issue: IssueProject = await axios
    .get(
      `${host}api/issues/${issueId}?fields=idReadable,summary,project(shortName,name),customFields(id,fieldType,value(id,name))`,
      config
    )
    .then((response) => {
      return response.data;
    });

  // Get current issue status
  const currentIssueStatus = issue.customFields.find((field) => field.$type === 'StateIssueCustomField').value.name;

  // Fetch project to get field types.
  const project: IssueProjectCustomFields = await axios
    .get(`${host}api/admin/projects/${issue.project.shortName}?fields=shortName,customFields(id,fieldType)`, config)
    .then((response) => {
      return response.data;
    });

  // Loop through project custom fields to find the first state field.
  const stateProjectCustomFieldId: any = project.customFields.find(
    (field) => field.$type === 'StateProjectCustomField'
  );

  if (!stateProjectCustomFieldId.id) {
    vscode.window.showErrorMessage(`Could not find a state field `);
  }

  // Get list of statuses
  const statuses: CustomFieldStatus = await axios
    .get(
      `${host}api/admin/projects/${issue.project.shortName}/customFields/${stateProjectCustomFieldId.id}?fields=name,id,bundle(id,name,values(isResolved,name,$type,id,ordinal,localizedName,showLocalizedNameInAdmin,description,color(id,$type),archived,hasRunningJob))`,
      config
    )
    .then((response) => {
      return response.data;
    });

  const orderedStatuses = orderBy(statuses.bundle.values, ['ordinal'], ['asc']);

  const statusArray: Array<vscode.QuickPickItem> = orderedStatuses.map((value: Value) => {
    let statusName;
    if (value.name === currentIssueStatus) {
      statusName = `$(play-circle) ${value.name}`;
    } else {
      statusName = `$(circle-large-outline) ${value.name}`;
    }

    return { label: statusName, description: value.isResolved ? 'Resolves issue' : '' };
  });

  // Ask the user to select a status, update the issue in youtrack.
  const result = await vscode.window.showQuickPick(statusArray, {
    // onDidSelectItem: (item) => vscode.window.showInformationMessage(`Focus: ${item}`),
  });

  const updatedStatus = orderedStatuses.find(
    (status) => status.name === result.label.substring(result.label.indexOf(' ') + 1, result.label.length)
  ); // Get the name of the status

  const updatedIssue = await axios
    .post(
      `${host}api/issues/${issueId}/fields/${stateProjectCustomFieldId.id}?fields=$type,id,value($type,archived,avatarUrl,buildLink,color(id),fullName,id,isResolved,localizedName,login,markdownText,minutes,name,presentation,ringId,text)`,
      {
        value: updatedStatus,
        id: stateProjectCustomFieldId.id,
        $type: 'StateIssueCustomField',
      },
      config
    )
    .then((response) => {
      return response.data;
    });

  console.log(updatedIssue);

  vscode.window.showInformationMessage(`NOT IMPLEMENTED update status ${issueId}`);
};
