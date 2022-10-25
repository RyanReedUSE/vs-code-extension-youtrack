![](https://raw.githubusercontent.com/huddleboards/youtrack-extension-images/main/YouTrack%20and%20Code.png)

# YouTrack Issues - VS Code Extension

This extension was created to streamline the development lifecycle for those that manage their issues within YouTrack. It aims to take the most used features within YouTrack and brings them to your VS Code environment.

The extension comes with two views on the sidebar that allow you to view a list of issues the current user's issues and another list that presents results of a selected saved search.

![](https://raw.githubusercontent.com/huddleboards/youtrack-extension-images/main/Extension%20Layout.png)

## Getting Started

1. Install the YouTrack Issues Extension here.
2. Go to your instance of YouTrack and get the host URL and [create a personal access token](https://www.jetbrains.com/help/youtrack/standalone/Manage-Permanent-Token.html#obtain-permanent-token) for authentication.
3. Open settings.json (or Settings UI) to add the following.

```json
{
  "youtrack.host": "https://xyz-site.myjetbrains.com/youtrack/", // Remember to include the full URL, including the last "/" as shown in the example.
  "youtrack.permanentToken": "perm:....." // Create a personal access token by following the steps on YouTrack's documentation linked in step 2.
}
```

## My Current Issues View

The current issues list view is designed to show the user their current assigned issues for easy access. The query for this view can be easily updated in the extensions settings if you prefer to see a different query. This default to `Assignee: me -Resolved order by: created`.

## Search Issues View

The search issues list view is similar to the current issues view, but it is used to take saved searches from your instance of YouTrack and allow you to pick it from a list or add another custom query. You can also group your searched issues here or see them as a flat list. The best use case for this view is for using a dynamic query that always shows the current sprint of one of your main boards.

# Features

## List YouTrack issues within the app's sidebar.

- List the user's current issues, which is typically used for filtering issues that are open and assigned to the current user.
- List issues based on saved searches from YouTrack, which is best used for having a pre-built search in YouTrack for the main development board and current sprint

## View an issue with a new webview with styled markdown.

- By clicking on an issue in the sidebar, a new tab will open to show the contents of the issue, as well as any custom fields and comments. Comments will display in reverse chronological order to ensure the latest comment is at the top.

## Update the issue status (state)

- Right clicking an issue or clicking the button within an issue view to update the state.

![](https://raw.githubusercontent.com/huddleboards/youtrack-extension-images/main/Update%20Issue%20State.png)
![](https://raw.githubusercontent.com/huddleboards/youtrack-extension-images/main/Update%20Issue%20State%20Selection.png)

## Create a branch from an issue

- Quickly create a new branch with the given issue id and name. This capitalizes the first letter for each word and removes spaces from the issue name, while also truncating the branch down to 28 characters to ensure it's compatible with the git branching format.

![](https://raw.githubusercontent.com/huddleboards/youtrack-extension-images/main/Create%20Branch.png)

## Record spent time for a given issue.

- Using YouTrack's duration format, enter in time spent for a given card. This applies to the current date as the date worked behind the scenes.

![](https://raw.githubusercontent.com/huddleboards/youtrack-extension-images/main/Add%20Time%20Spent.png)

## Pin an Issue

- Pin an issue to the app's status bar for quick access to the issue while your working on other files or have the sidebar open to a different view.

![](https://raw.githubusercontent.com/huddleboards/youtrack-extension-images/main/Pin%20Issue.png)

# Requirements

Using this extension requires a valid subscription to YouTrack. At the time of writing this, it's free to use for teams of 1-10 people. [YouTrack](https://www.jetbrains.com/youtrack/buy/#incloud?billing=yearly).

# Settings

```json
{
  "youtrack.host": "https://xyz-site.myjetbrains.com/youtrack/", // Requires users input before use
  "youtrack.permanentToken": "perm:......", // Requires users input before use
  "youtrack.currentIssuesMaxResponseCount": 20,
  "youtrack.currentIssuesQuery": "Assignee: me -Resolved order by: created",
  "youtrack.searchIssuesGroupByStatus": true,
  "youtrack.searchIssuesMaxResponseCount": 100
}
```

## Road Map

- [ ] Add support to show issue attachments.
- [x] Add support to show issue comments.
- [x] Add support to add quick comments to an issue.

## Author

[@RyanReedUSE](https://github.com/ryanreeduse)

## Notes

> This is an unofficial YouTrack extension and is not a product of JetBrains. It's simply a VS Code Extension designed to work with the YouTrack REST API to provide YouTrack users with another option to view their issues.
