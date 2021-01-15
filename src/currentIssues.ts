import * as moment from 'moment';
import * as vscode from 'vscode';
import { searchIssues } from './data/searchIssues';
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
  async getChildren(element?: Issue): Promise<Issue[]> | null {
    const youtrackPinIssueId = this.context.globalState.get('youtrackPinIssueId') as string;
    const issues = await searchIssues(this.context);

    const issuesResponse = issues.map((issue) => {
      return new Issue(
        issue.idReadable,
        issue.idReadable,
        issue.summary,
        issue.reporter.fullName,
        moment(issue.created).format('DD MMM YYYY'),
        vscode.TreeItemCollapsibleState.None,
        issue.resolved,
        {
          command: 'youtrack.viewIssue',
          title: '',
          arguments: [undefined, issue.idReadable],
        },
        youtrackPinIssueId
      );
    });

    return issuesResponse;
  }
}
