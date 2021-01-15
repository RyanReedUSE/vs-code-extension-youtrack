import * as vscode from 'vscode';
import axios from 'axios';
import { CustomFieldStatus, IssueProject, IssueProjectCustomFields, Value } from './model';
import { orderBy } from 'lodash';

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
  const result = await vscode.window.showQuickPick(statusArray, {});

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

  vscode.window.showInformationMessage(`NOT IMPLEMENTED update status ${issueId}`);
};
