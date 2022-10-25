import * as vscode from 'vscode';
import fetch from 'cross-fetch';

/**
 * Add Spent Time for the Given Issue Id
 */
export async function addComment(issueId: string): Promise<any> {
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

  // Prompt the user to enter their comment
  const comment: string = await vscode.window.showInputBox({
    prompt: `Enter a comment for Issue ${issueId}.`,
    placeHolder: 'Enter a comment',
  });

  if (!comment) {
    vscode.window.showWarningMessage('No value was provided for the comment.');
    return;
  }

  const url = `${host}api/issues/${issueId}/comments?fields=id,author%28login,name,id%29,deleted,text,updated`;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${permanentToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: comment,
    }),
  };

  console.log('add comment', url, options);

  fetch(url, options)
    .then((response) => {
      // handle the response
      console.log(response.json());
    })
    .catch((error) => {
      // handle the error
      console.log(error.json());
    });
}
