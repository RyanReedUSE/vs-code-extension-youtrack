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
    public readonly resolved?: string,
    public readonly command?: vscode.Command,
    public readonly youtrackPinIssueId?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = this.command
      ? `${this.label}-${this.summary}\n\nCreated By:  ${this.createdBy}\nCreated On:  ${this.createdOn}`
      : `${this.label} (${this.summary} issues)`;
    this.description = this.summary;
  }

  // Match the icon to the resolved state, empty square for unresolved, checkmark for resolved

  iconPath = this.command
    ? {
        light:
          this.id === this.youtrackPinIssueId
            ? path.join(__filename, '..', '..', 'resources', 'light', 'pinned.svg')
            : this.resolved
            ? path.join(__filename, '..', '..', 'resources', 'light', 'check.svg')
            : path.join(__filename, '..', '..', 'resources', 'light', 'square.svg'),
        dark:
          this.id === this.youtrackPinIssueId
            ? path.join(__filename, '..', '..', 'resources', 'dark', 'pinned.svg')
            : this.resolved
            ? path.join(__filename, '..', '..', 'resources', 'dark', 'check.svg')
            : path.join(__filename, '..', '..', 'resources', 'dark', 'square.svg'),
      }
    : undefined;

  contextValue = this.command ? 'issue' : 'issue-group';
}
