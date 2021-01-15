import * as moment from 'moment';
import * as vscode from 'vscode';
import { searchIssues } from './data/searchIssues';
import { Issue } from './Issue';
import { groupBy, orderBy } from 'lodash';
import { SearchIssue, IssueTransformed, IssueGrouped } from './data/searchIssuesModel';

export class searchIssuesProvider implements vscode.TreeDataProvider<TreeItem> {
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public context: vscode.ExtensionContext;

  data: TreeItem[];

  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | void> = new vscode.EventEmitter<
    TreeItem | undefined | void
  >();

  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  async refresh(): Promise<void> {
    this.data = await this.getData();
    await this.getChildren();
    this._onDidChangeTreeData.fire();
  }

  async getData(): Promise<Array<TreeItem>> {
    const youtrackPinIssueId = this.context.globalState.get('youtrackPinIssueId') as string;
    const searchIssuesGroupByStatus = vscode.workspace
      .getConfiguration('youtrack')
      .get('searchIssuesGroupByStatus') as boolean;
    const issues = await searchIssues(this.context);

    if (searchIssuesGroupByStatus) {
      const issuesTransformed: Array<IssueTransformed> = issues.map((issue: SearchIssue) => {
        const issueStatus = issue.customFields.find((field) => field.$type === 'StateIssueCustomField').value;

        return {
          ...issue,
          status: issueStatus.name as string,
          ordinal: issueStatus.ordinal as number,
        };
      });

      // Order Issues by Ordinal
      const issuesOrdered = orderBy(issuesTransformed, ['ordinal'], ['asc']) as Array<IssueTransformed>;
      // Group Issues by Status
      const issuesGrouped = groupBy(issuesOrdered, 'status') as IssueGrouped;

      const issuesResponse = Object.keys(issuesGrouped).map((key, index) => {
        const children = issuesGrouped[key].map((issue) => {
          return new TreeItem(
            new Issue(
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
            )
          );
        });
        // Push key to Issue Repo
        const treeItem = new TreeItem(
          new Issue(key, key, children.length.toString(), ' ', ' ', vscode.TreeItemCollapsibleState.Collapsed),
          children
        );
        return treeItem;
      });
      return issuesResponse;
    } else {
      const issuesResponse = issues.map((issue) => {
        return new TreeItem(
          new Issue(
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
          )
        );
      });

      return issuesResponse;
    }
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (element) {
      return Promise.resolve(element.children);
    } else {
      return Promise.resolve(this.data);
    }
  }
}

class TreeItem extends Issue {
  children: TreeItem[] | undefined;

  constructor(issue: Issue, children?: TreeItem[]) {
    super(
      issue.label,
      issue.id,
      issue.summary,
      issue.createdBy,
      issue.createdOn,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded,
      issue.command,
      issue.youtrackPinIssueId
    ),
      (this.children = children);
  }
}
