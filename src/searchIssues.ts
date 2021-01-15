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
    await this.getChildren();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  // getChildren(element?: TreeItem): Thenable<TreeItem[]> {
  //   if (element) {
  //     return Promise.resolve(element.children);
  //   } else {
  //     return Promise.resolve(this.data);
  //   }
  // }

  /**
   * Search YouTrack issues
   */
  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
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
        // Push key to Issue Repo
        const treeItem = new TreeItem(
          new Issue(key, key, ' ', ' ', ' ', vscode.TreeItemCollapsibleState.Expanded),
          issuesGrouped[key].map((issue) => {
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
          })
        );
        console.log(treeItem);
        return treeItem;
      });

      // console.log(issuesResponse);

      //   // Loop through children and push them to issue.
      //   const group = issuesGrouped[key].map((issue) => {
      //     issuesResponse.push(
      //       new Issue(
      //         issue.idReadable,
      //         issue.idReadable,
      //         issue.summary,
      //         issue.reporter.fullName,
      //         moment(issue.created).format('DD MMM YYYY'),
      //         vscode.TreeItemCollapsibleState.None,
      //         {
      //           command: 'youtrack.viewIssue',
      //           title: '',
      //           arguments: [undefined, issue.idReadable],
      //         },
      //         youtrackPinIssueId
      //       )
      //     );
      //   });
      //   issuesResponse.push(...group);
      // });

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
}

class TreeItem extends Issue {
  children: TreeItem[] | Issue[] | undefined;

  constructor(issue: Issue, children?: TreeItem[] | Issue[]) {
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
