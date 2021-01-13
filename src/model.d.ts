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
