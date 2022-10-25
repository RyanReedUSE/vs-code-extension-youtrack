export interface SearchIssue {
  idReadable: string;
  resolved?: any;
  summary: string;
  reporter: Reporter;
  customFields: CustomField[];
  created: any;
  $type: string;
}

export interface Reporter {
  fullName: string;
  login: string;
  $type: string;
}

export interface CustomField {
  value: any;
  name: string;
  id: string;
  $type: string;
}

export interface IssueTransformed {
  status: string;
  ordinal: number;
  idReadable: string;
  resolved?: any;
  summary: string;
  reporter: Reporter;
  customFields: CustomField[];
  created: any;
  $type: string;
}

export interface IssueGrouped {
  [key: string]: Array<IssueTransformed>;
}
