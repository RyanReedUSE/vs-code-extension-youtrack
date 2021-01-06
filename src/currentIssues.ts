import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

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
    // TODO: Do not limit the user from being able to see issues, even in an empty workspace. Remove the following.
    // if (!this.workspaceRoot) {
    //   vscode.window.showInformationMessage('No issue in empty workspace');
    //   return Promise.resolve([]);
    // }

    // Fetch Current Issues from YouTrack
    // const issues = ;

    // if (issues) {
    console.log(await this.getCurrentIssues());

    return await this.getCurrentIssues();
    // } else {
    //   vscode.window.showInformationMessage('User has no current YouTrack issues.');
    //   return Promise.resolve([]);
    // }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  //   private getDepsInPackageJson(packageJsonPath: string): Issue[] {
  //     if (this.pathExists(packageJsonPath)) {
  //       const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  //       const toDep = (moduleName: string, version: string): Issue => {
  //         if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
  //           return new Issue(moduleName, version, vscode.TreeItemCollapsibleState.Collapsed);
  //         } else {
  //           return new Issue(moduleName, version, vscode.TreeItemCollapsibleState.None, {
  //             command: 'extension.openPackageOnNpm',
  //             title: '',
  //             arguments: [moduleName],
  //           });
  //         }
  //       };

  //       const deps = packageJson.dependencies
  //         ? Object.keys(packageJson.dependencies).map((dep) => toDep(dep, packageJson.dependencies[dep]))
  //         : [];
  //       const devDeps = packageJson.devDependencies
  //         ? Object.keys(packageJson.devDependencies).map((dep) => toDep(dep, packageJson.devDependencies[dep]))
  //         : [];
  //       return deps.concat(devDeps);
  //     } else {
  //       return [];
  //     }
  //   }

  /**
   * Given the YouTrack Extension Settings, returns an array of current issues.
   */
  private async getCurrentIssues(): Promise<Issue[]> {
    // Get YouTrack Extension Settings
    const host = vscode.workspace.getConfiguration('youtrack').get('host');
    const permanentToken = vscode.workspace.getConfiguration('youtrack').get('permanentToken');
    const currentIssuesQuery = vscode.workspace.getConfiguration('youtrack').get('currentIssuesQuery');

    if (!host || !permanentToken || !currentIssuesQuery) {
      vscode.window.showErrorMessage('User has no current YouTrack issues.');
      return [];
    }

    const config = {
      headers: { Authorization: `Bearer ${permanentToken}` },
    };

    const issues = await axios
      .get(
        `${host}api/issues?fields=idReadable,summary,resolved,created,customFields(name,value(id,name,login,fullName))&$top=20&query=${currentIssuesQuery}`,
        config
      )
      .then((response) => {
        if (response.data) {
          const issuesResponse = response.data.map((issue) => {
            return new Issue(issue.idReadable, issue.idReadable, issue.summary, vscode.TreeItemCollapsibleState.None, {
              command: 'vscode.window.showInformationMessage',
              title: '',
              arguments: ['TODO: Open the issue in a new tab.'],
            });
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
    private readonly version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}\n ${this.version}`;
    this.description = this.version;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'go-to-file.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'go-to-file.svg'),
  };

  contextValue = 'issue';
}
