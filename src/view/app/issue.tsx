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

  /*
   * Render Title Block
   */
  private renderTitleBlock = () => {
    return (
      <div className="grid">
        <h1>
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

  private renderCustomFields = () => {
    const { issueData } = this.props;

    return issueData.customFields.map((field) => {
      return (
        <div key={field.name}>
          <div>
            <b>{field.name}</b>
          </div>
          {!!field.value && !field.value.minutes ? (
            <div className="mb-3 h-6">{field.value && field.value.name ? field.value?.name : '-'}</div>
          ) : (
            <div className="mb-3 h-6">{field.value && field.value.minutes ? field.value?.presentation : '-'}</div>
          )}
        </div>
      );
    });
  };

  /*
   * Transform Markdown
   * Update convert markdown images to URLs from attachments
   */
  private transformMarkdown = () => {
    const { issueData, host } = this.props;
    let descriptionMarkdown = issueData.description;

    issueData.attachments.forEach((attachment) => {
      descriptionMarkdown = descriptionMarkdown.replace(attachment.name, `${host}${attachment.url}`);
    });

    return descriptionMarkdown;
  };

  render() {
    const { issueData, vscode } = this.props;

    return (
      !!issueData && (
        <>
          <div className="mt-3">
            <button className="w-1/6 mr-3">Edit</button>
            <button
              className="w-1/6 mx-3"
              onClick={() =>
                vscode.postMessage({
                  command: 'updateStatus',
                  text: issueData.idReadable,
                })
              }
            >
              Update Status
            </button>
            <button
              className="w-1/6 ml-3"
              onClick={() =>
                vscode.postMessage({
                  command: 'createBranch',
                  text: `${issueData.idReadable}_${issueData.summary.replace(/ /g, '')}`,
                })
              }
            >
              Create Branch
            </button>
          </div>
          {this.renderTitleBlock()}
          <hr className="mt-4 mb-4"></hr>
          <div className="grid grid-cols-3">
            <div className="md:col-span-2 col-span-3">
              <ReactMarkdown
                renderers={this.renderers}
                plugins={[gfm]}
                children={this.transformMarkdown()}
              ></ReactMarkdown>
            </div>
            <div className="md:col-span-1 col-span-3 sm:order-first xs:order-first md:order-last">
              <div
                className="mx-3 mb-3 p-8"
                style={{ backgroundColor: 'var(--vscode-breadcrumbPicker-background)', borderRadius: '8px' }}
              >
                {this.renderCustomFields()}
              </div>
            </div>
          </div>
        </>
      )
    );
  }
}
