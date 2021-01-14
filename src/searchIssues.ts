import * as moment from 'moment';
import * as vscode from 'vscode';
import { searchIssues } from './data/searchIssues';
import { Issue } from './Issue';
import { groupBy } from 'lodash';
import { SearchIssue } from './data/searchIssuesModel';

export class searchIssuesProvider implements vscode.TreeDataProvider<Issue> {
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
   * Search YouTrack issues
   */
  async getChildren(element?: Issue): Promise<Issue[]> {
    const youtrackPinIssueId = this.context.globalState.get('youtrackPinIssueId') as string;
    const searchIssuesGroupByStatus = vscode.workspace
      .getConfiguration('youtrack')
      .get('searchIssuesGroupByStatus') as boolean;
    const issues = await searchIssues(this.context);

    if (searchIssuesGroupByStatus) {
      const issuesTransformed = issues.map((issue: SearchIssue) => {
        const issueStatus = issue.customFields.find((field) => field.$type === 'StateIssueCustomField').value;

        return {
          ...issue,
          status: issueStatus.name,
          ordinal: issueStatus.ordinal,
        };
      });

      // TODO: Order issues by ordinal.

      // TODO: Group Issues
      console.log(groupBy(issuesTransformed, 'status'));
    }

    const issuesResponse = issues.map((issue) => {
      return new Issue(
        issue.idReadable,
        issue.idReadable,
        issue.summary,
        issue.reporter.fullName,
        moment(issue.created).format('DD MMM YYYY'),
        vscode.TreeItemCollapsibleState.None,
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
