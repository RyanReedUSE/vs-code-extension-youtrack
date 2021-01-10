import * as React from 'react';
import { IIssue } from './model';
import * as ReactMarkdown from 'react-markdown';
import * as gfm from 'remark-gfm';

interface IIssueProps {
  vscode: any;
  issueData: IIssue;
}

export default class IssuePreview extends React.Component<IIssueProps> {
  constructor(props: any) {
    super(props);

    // const initialData = this.props.initialData;

    const oldState = this.props.vscode.getState();
    if (oldState) {
      this.state = oldState;
    } else {
      this.state = {}; // Get from global window
    }
  }

  // private renderReactMarkdown() {
  //   return <ReactMarkdown plugins={[gfm]} children={this.value}></ReactMarkdown>;
  // }

  render() {
    console.log(this.props.issueData);

    return (
      !!this.props.issueData && (
        <>
          <div>
            <h1 className="">{this.props.issueData.idReadable}</h1>
          </div>
          <div className="grid">
            <h1 className="text-3xl text-bold">{this.props.issueData.idReadable}</h1>
            <h1 className="text-3xl">{this.props.issueData.summary}</h1>
          </div>
          <hr></hr>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <h3>Issue Description</h3>
              <ReactMarkdown plugins={[gfm]} children={this.props.issueData.description}></ReactMarkdown>
            </div>
            <div className="col-span-1">Issue Custom Fields</div>
          </div>
        </>
      )
    );
  }
}
