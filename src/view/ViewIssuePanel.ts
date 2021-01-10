import axios from 'axios';
import * as vscode from 'vscode';
import { getNonce } from '../getNonce';

async function fetchIssueData(issueId: string): Promise<any> {
  // Get YouTrack Extension Settings
  const host = vscode.workspace.getConfiguration('youtrack').get('host');
  const permanentToken = vscode.workspace.getConfiguration('youtrack').get('permanentToken');

  // Validate that the user has all required settings
  if (!host) {
    vscode.window.showErrorMessage('YouTrack: Missing host setting. Please configure extension settings.');
    return undefined;
  }
  if (!permanentToken) {
    vscode.window.showErrorMessage('YouTrack: Missing token. Please configure extension settings.');
    return undefined;
  }

  const config = {
    headers: { Authorization: `Bearer ${permanentToken}` },
  };

  const issues = await axios
    .get(
      `${host}api/issues/${issueId}?fields=idReadable,summary,resolved,created,updated,numberInProject,project(shortName,name),description,reporter(login,fullName,email,avatarUrl),updater(login,fullName,email,avatarUrl),votes,comments(text,created,updated,author(login,fullName)),commentsCount,tags(color(background,foreground),name),links(direction,linkType,issues(idReadable,summary)),attachments(name,url),usesMarkdown,customFields(name,value(id,name,login,fullName))`,
      config
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return undefined;
    });

  return issues;
}

export class ViewIssuePanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: ViewIssuePanel | undefined;

  public static readonly viewType = 'view-issue';

  private _issueData: any;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static async createOrShow(extensionUri: vscode.Uri, issueId: string) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    // If we already have a panel, show it.
    if (ViewIssuePanel.currentPanel) {
      ViewIssuePanel.currentPanel._panel.reveal(column);
      ViewIssuePanel.currentPanel._update();
      return;
    }

    // Otherwise, create a new panel.

    const panel = vscode.window.createWebviewPanel(ViewIssuePanel.viewType, issueId, column || vscode.ViewColumn.One, {
      // Enable javascript in the webview
      enableScripts: true,

      // And restrict the webview to only loading content from our extension's `media` directory.
      localResourceRoots: [
        vscode.Uri.joinPath(extensionUri, 'media'),
        vscode.Uri.joinPath(extensionUri, 'out/compiled'),
        vscode.Uri.joinPath(extensionUri, 'issueViewer'),
      ],
    });

    const issueData = await fetchIssueData(issueId);

    ViewIssuePanel.currentPanel = new ViewIssuePanel(panel, extensionUri, issueData);

    setTimeout(() => {
      vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools');
    }, 500);
  }

  public static kill() {
    ViewIssuePanel.currentPanel?.dispose();
    ViewIssuePanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, issueData: any) {
    ViewIssuePanel.currentPanel = new ViewIssuePanel(panel, extensionUri, issueData);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, issueData: any) {
    this._issueData = issueData;
    this._panel = panel;
    this._extensionUri = extensionUri;
    // Set the WebView's initial html content
    this._update();
    // Set the youtrack app icon
    this._panel.iconPath = vscode.Uri.joinPath(extensionUri, 'resources/youtrack.png');
    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // // Handle messages from the webview
    // this._panel.webview.onDidReceiveMessage(
    //   (message) => {
    //     switch (message.command) {
    //       case "alert":
    //         vscode.window.showErrorMessage(message.text);
    //         return;
    //     }
    //   },
    //   null,
    //   this._disposables
    // );
  }

  public dispose() {
    ViewIssuePanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'onInfo': {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case 'onError': {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'issueViewer', 'issueViewer.js'));

    // Uri to load styles into webview, additional styles loaded through tailwindcss
    const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
    const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));

    // // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 img-src https:;
                 script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                 style-src vscode-resource: 'unsafe-inline';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script nonce="${nonce}">
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.issueData = ${JSON.stringify(this._issueData)};
        </script>
			</head>
      <body>
        <div id="root"></div>
        <script src="${scriptUri}" nonce="${nonce}">
			</body>
			</html>`;
  }
}
