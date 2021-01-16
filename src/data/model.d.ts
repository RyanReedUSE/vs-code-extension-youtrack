export interface Project {
  shortName: string;
  name: string;
  $type: string;
}

export interface CustomField {
  value: any;
  id: string;
  $type: string;
}

export interface IssueProject {
  project: Project;
  idReadable: string;
  summary: string;
  customFields: CustomField[];
  $type: string;
}

export interface IssueProjectCustomFields {
  shortName: string;
  customFields: CustomField[];
  $type: string;
}

export interface Color {
  id: string;
  $type: string;
}
export interface Value {
  isResolved: boolean;
  localizedName?: any;
  showLocalizedNameInAdmin: boolean;
  description: string;
  ordinal: number;
  color: Color;
  archived: boolean;
  hasRunningJob: boolean;
  name: string;
  id: string;
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

export interface Duration {
  presentation: string;
  minutes: number;
  $type: string;
}

export interface SpentTime {
  duration: Duration;
  id: string;
  $type: string;
}
