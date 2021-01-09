import * as React from 'react';
import { IIssue } from './model';

interface IIssueProps {
  vscode: any;
  initialData: IIssue;
}

interface IIssueState {
  config: string;
}

export default class Issue extends React.Component<IIssueProps, IIssueState> {
  constructor(props: any) {
    super(props);

    const initialData = this.props.initialData;

    const oldState = this.props.vscode.getState();
    if (oldState) {
      this.state = oldState;
    } else {
      this.state = { config: 'hello' };
    }
  }

  render() {
    return (
      <>
        <h1>Hello World</h1>
      </>
    );
  }
}
