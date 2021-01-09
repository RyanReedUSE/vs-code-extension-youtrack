import * as React from 'react';
import { IIssue } from './model';
import * as ReactMarkdown from 'react-markdown';
import * as gfm from 'remark-gfm';

interface IIssueProps {
  vscode: any;
  initialData: IIssue;
}

interface IIssueState {
  config: string; // TODO: Remove
}

export default class Issue extends React.Component<IIssueProps, IIssueState> {
  constructor(props: any) {
    super(props);

    // const initialData = this.props.initialData;

    const oldState = this.props.vscode.getState();
    if (oldState) {
      this.state = oldState;
    } else {
      this.state = { config: 'hello' };
    }
  }

  value =
    "### Technical Tasks:\n\n #### GET - search weblem data\n> perform an `upsert` for all of the data provided. data is provided as an array of objects typically uploaded in postman for the first phase of the project. \n\n```js\nconst webLemImportExample = [\n  { \n    webLemId: 'string', \n    system: 'string', \n    type: 'string', \n    material: 'string', \n    materialDetail: 'string', \n    dataLabel: 'string', \n    componentMethodValue: 1.25, \n    workActivityMethodValue: 1.38, \n    laborEstimateBreakdownData: { \n      weight: 22.2, \n      sizeAttributes: [\n        { \n          key: 'string', \n          value: 1, \n }, \n], \n      effectiveOn: 'String', \n }, \n }, \n]; \n```\n#### POST - import weblem data\n\n>Add filters for limit, offset, type, material, weblemId, system, & materialDetail\n\n```js\nconst searchExample = { \n  results: [\n    { \n      modelId: { \n        modelKey: 'string', \n        version: 1, \n }, \n      version: { \n        by: { \n          modelId: { \n            modelKey: 'string', \n            version: 1, \n }, \n }, \n        dateTime: String, \n        version: 1, \n }, \n      webLemId: 'string', \n      system: 'string', \n      type: 'string', \n      material: 'string', \n      materialDetail: 'string', \n      dataLabel: 'string', \n      componentMethodValue: 1.25, \n      componentMethodValue: 1.38, \n      laborEstimateBreakdownData: { \n        weight: 22.2, \n        sizeAttributes: [\n          { \n            key: 'string', \n            value: 1, \n }, \n], \n        effectiveOn: 'String', \n }, \n }, \n], \n  resultCount: 1, \n }; \n```\n\n\nSingle endpoint here, rather than four endpoints:\n![](image1.png)\n### User Experience & User Interface Mockups:\n![](image.png)\n### Acceptance Criteria:\n\n### Notes:";

  render() {
    return (
      <>
        <ReactMarkdown plugins={[gfm]} children={this.value}></ReactMarkdown>
      </>
    );
  }
}
