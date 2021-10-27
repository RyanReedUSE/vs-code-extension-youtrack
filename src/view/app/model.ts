export interface IIssue {
  updated: number;
  project: Project;
  resolved?: any;
  summary: string;
  numberInProject: number;
  votes: number;
  reporter: Reporter;
  usesMarkdown: boolean;
  idReadable: string;
  tags: any[];
  attachments: Attachment[];
  customFields: CustomField[];
  updater: Updater;
  comments: Comment[];
  commentsCount: number;
  links: Link[];
  created: number;
  description: string;
  $type: string;
}

export interface Comment {
  id:string;
  text: string;
  created: string;
  updated: string;
  usesMarkdown: boolean;
  author: {
    login: string,
    fullName: string
  };
}

export interface Project {
  shortName: string;
  name: string;
  $type: string;
}

export interface Reporter {
  email: string;
  avatarUrl: string;
  login: string;
  fullName: string;
  $type: string;
}

export interface Attachment {
  url: string;
  name: string;
  $type: string;
}

export interface CustomField {
  value: any;
  name: string;
  $type: string;
}
export interface Updater {
  email: string;
  avatarUrl: string;
  login: string;
  fullName: string;
  $type: string;
}

export interface LinkType {
  $type: string;
}

export interface Link {
  direction: string;
  linkType: LinkType;
  issues: any[];
  $type: string;
}
