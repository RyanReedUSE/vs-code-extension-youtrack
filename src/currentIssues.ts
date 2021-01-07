import * as vscode from 'vscode';
import * as path from 'path';
import axios from 'axios';
import * as moment from 'moment';

export class currentIssuesProvider implements vscode.TreeDataProvider<Issue> {
  private _onDidChangeTreeData: vscode.EventEmitter<Issue | undefined | void> = new vscode.EventEmitter<
    Issue | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<Issue | undefined | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Issue): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: Issue): Promise<Issue[]> {
    // Fetch current YouTrack issues
    return await this.getCurrentIssues();
  }

  /**
   * Given the YouTrack Extension Settings, returns an array of current issues.
   */
  private async getCurrentIssues(): Promise<Issue[]> {
    // Get YouTrack Extension Settings
    const host = vscode.workspace.getConfiguration('youtrack').get('host');
    const permanentToken = vscode.workspace.getConfiguration('youtrack').get('permanentToken');
    const currentIssuesQuery = vscode.workspace.getConfiguration('youtrack').get('currentIssuesQuery');

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

    const issues = await axios
      .get(
        `${host}api/issues?fields=idReadable,summary,resolved,reporter(login,fullName),created,customFields(name,value(id,name,login,fullName))&$top=20&query=${currentIssuesQuery}`,
        config
      )
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          const issuesResponse = response.data.map((issue) => {
            return new Issue(
              issue.idReadable,
              issue.idReadable,
              issue.summary,
              issue.reporter.fullName,
              moment(issue.created).format('DD MMM YYYY'),
              vscode.TreeItemCollapsibleState.None,
              {
                command: 'workbench.action.files.openFile', // TODO: Call a command to open the preview
                title: '',
                arguments: [],
              }
            );
          });
          return issuesResponse;
        }
      })
      .catch((err) => {
        return [];
      });

    return issues;
  }
}

export class Issue extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly id: string,
    public readonly summary: string,
    public readonly createdBy: string,
    public readonly createdOn: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.summary}\n\nCreated By:  ${this.createdBy}\nCreated On:  ${this.createdOn}`;
    this.description = this.summary;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'go-to-file.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'go-to-file.svg'),
  };

  contextValue = 'issue';
}
