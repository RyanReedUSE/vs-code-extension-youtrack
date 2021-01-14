import * as vscode from 'vscode';
import { getCurrentIssues } from './data/getCurrentIssues';
import { Issue } from './Issue';

export class currentIssuesProvider implements vscode.TreeDataProvider<Issue> {
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public context: vscode.ExtensionContext;

  private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined | void> = new vscode.EventEmitter<
    Issue | undefined | void
  >();

  readonly onDidChangeTreeData: vscode.Event<Issue | undefined | null | void> = this._onDidChangeTreeData.event;

  async refresh(): Promise<void> {
    await this.getChildren();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Issue): vscode.TreeItem {
    return element;
  }

  /**
   * Fetch current YouTrack issues
   */
  async getChildren(element?: Issue): Promise<Issue[]> {
    return await getCurrentIssues();
  }
}
