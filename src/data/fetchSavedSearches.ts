import * as vscode from 'vscode';
import axios from 'axios';
import { SavedSearches } from './savedSearchesModel';

/**
 * Given the YouTrack Extension Settings, returns an array of current issues.
 */
export async function fetchSavedSearches(context: vscode.ExtensionContext): Promise<vscode.QuickPickItem | undefined> {
  // Get YouTrack Extension Settings
  let myQuery;
  const host = vscode.workspace.getConfiguration('youtrack').get('host');
  const permanentToken = vscode.workspace.getConfiguration('youtrack').get('permanentToken');

  const config = {
    headers: { Authorization: `Bearer ${permanentToken}` },
  };

  const savedSearches: SavedSearches = await axios
    .get(`${host}api/users/me?fields=login,savedQueries(query,name)`, config)
    .then((response) => {
      if (response.data) {
        return response.data;
      }
    })
    .catch((err) => {
      return [];
    });

  const searchArray: Array<vscode.QuickPickItem> = savedSearches.savedQueries.map((query) => {
    return { label: query.name, detail: query.query };
  });

  searchArray.push({
    label: '$(add) Add my own search',
    detail: 'Using the YouTrack Search syntax, supply your own query.',
    alwaysShow: true,
  });

  // Ask the user to select a search, update the issue in youtrack.
  const result = await vscode.window.showQuickPick(searchArray, {
    // onDidSelectItem: (item) => vscode.window.showInformationMessage(`Focus: ${item}`),
  });

  if (!result) {
    vscode.window.showInformationMessage(`No search query selected.`);
    return undefined;
  }

  if (result.label.includes('Add my own search')) {
    // Prompt the user to enter their own youtrack query
    myQuery = await vscode.window.showInputBox({
      prompt: 'Please enter a YouTrack query to search issues.',
      placeHolder: 'Enter a valid YouTrack query (For example: "Assignee: me -Resolved")',
    });

    if (!myQuery) {
      return undefined;
    }
  }

  // Set the global state for Saved Search, if the user provided their own query, use that,
  // otherwise use the selected query
  context.globalState.update('savedSearchQuery', myQuery ? myQuery : result.detail);

  console.log(context.globalState.get('savedSearchQuery'));
  // Refresh the Search Issues tree
  vscode.commands.executeCommand('youtrack.searchIssues.refresh');

  return result;
}
