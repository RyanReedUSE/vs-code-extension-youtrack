export interface IssueProject {
  project: Project;
  idReadable: string;
  summary: string;
  $type: string;
}

export interface Project {
  shortName: string;
  name: string;
  $type: string;
}

export interface CustomField {
  id: string;
  $type: string;
}

export interface IssueProjectCustomFields {
  shortName: string;
  customFields: CustomField[];
  $type: string;
}

export interface Value {
  isResolved: boolean;
  name: string;
  $type: string;
}

export interface Bundle {
  values: Value[];
  name: string;
  id: string;
  $type: string;
}

export interface CustomFieldStatus {
  bundle: Bundle;
  id: string;
  $type: string;
}
