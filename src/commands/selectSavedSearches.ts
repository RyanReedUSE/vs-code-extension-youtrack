import * as vscode from 'vscode';
import { fetchSavedSearches } from '../data/fetchSavedSearches';

/**
 * selectSavedSearches - Registers Select Saved Searches Command
 *
 * @param context
 */
export const selectSavedSearchesCommand = (context: vscode.ExtensionContext) => {
  vscode.commands.registerCommand('youtrack.searchIssues.selectSavedSearches', () => {
    fetchSavedSearches(context);
  });
};
