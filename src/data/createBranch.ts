import * as vscode from 'vscode';

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

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const sanitize = (name: string) =>
    name
      ? name
          .trim()
          .replace(/^-+/, '')
          .replace(/^\.|\/\.|\.\.|~|\^|:|\/$|\.lock$|\.lock\/|\\|\*|\s|^\s*$|\.$|\[|\]$/g, branchWhitespaceChar)
      : name;

  const capitalizeBranchName = branchName
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
    .replace(/ /g, '');

  const result = await vscode.window.showInputBox({
    value: sanitize(capitalizeBranchName).substring(0, 28),
    prompt: 'Please provide or confirm a new branch name.',
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
