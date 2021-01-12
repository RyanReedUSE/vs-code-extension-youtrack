import * as moment from 'moment';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as gfm from 'remark-gfm';
import { IIssue } from './model';

interface IIssueProps {
  vscode: any;
  host: string;
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

  private renderers = {
    code: ({ language, value }) => {
      return <SyntaxHighlighter style={a11yDark} language={language} children={value} showLineNumbers={true} />;
    },
  };

  private renderTitleBlock = () => {
    return (
      <div className="grid">
        <h1 className="">
          <b>{this.props.issueData.idReadable}</b> {this.props.issueData.summary}
        </h1>
        <p className="text-gray-400">
          Created by{' '}
          <a href={`admin/hub/users/${this.props.issueData.reporter.login}`}>
            {this.props.issueData.reporter.fullName}
          </a>{' '}
          {moment(this.props.issueData.created).fromNow()}
        </p>
        <p className="text-gray-400">
          Updated by{' '}
          <a href={`admin/hub/users/${this.props.issueData.updater.login}`}>{this.props.issueData.updater.fullName}</a>{' '}
          {moment(this.props.issueData.updated).fromNow()}
        </p>
      </div>
    );
  };

  /*
   * Transform Markdown
   * Update convert markdown images to URLs from attachments
   */
  private transformMarkdown = () => {
    const { issueData, host } = this.props;

    let descriptionMarkdown = issueData.description;

    issueData.attachments.forEach((attachment) => {
      console.log(descriptionMarkdown.replace(attachment.name, `${host}${attachment.url}`));
      descriptionMarkdown = descriptionMarkdown.replace(attachment.name, `${host}${attachment.url}`);
    });

    console.log(descriptionMarkdown);

    return descriptionMarkdown;
  };

  render() {
    process;
    console.log(this.props.issueData);

    return (
      !!this.props.issueData && (
        <>
          {this.renderTitleBlock()}
          <hr className="mt-4 mb-4"></hr>
          <div className="grid grid-cols-3">
            <div className="col-span-2">
              <ReactMarkdown
                renderers={this.renderers}
                plugins={[gfm]}
                children={this.transformMarkdown()}
              ></ReactMarkdown>
            </div>
            <div className="col-span-1">Issue Custom Fields</div>
          </div>
        </>
      )
    );
  }
}
