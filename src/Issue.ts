import * as vscode from 'vscode';
import * as path from 'path';

export class Issue extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly id: string,
    public readonly summary: string,
    public readonly createdBy: string,
    public readonly createdOn: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly youtrackPinIssueId?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.summary}\n\nCreated By:  ${this.createdBy}\nCreated On:  ${this.createdOn}`;
    this.description = this.summary;
  }

  // TODO: Update the icon to match the resolved state, empty square for unresolved, checkmark for resolved

  iconPath = {
    light:
      this.id === this.youtrackPinIssueId
        ? path.join(__filename, '..', '..', 'resources', 'light', 'pinned.svg')
        : path.join(__filename, '..', '..', 'resources', 'light', 'go-to-file.svg'),
    dark:
      this.id === this.youtrackPinIssueId
        ? path.join(__filename, '..', '..', 'resources', 'dark', 'pinned.svg')
        : path.join(__filename, '..', '..', 'resources', 'dark', 'go-to-file.svg'),
  };

  contextValue = 'issue';
}
