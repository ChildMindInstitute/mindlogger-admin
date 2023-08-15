export type Reviewer = {
  name: string;
  email: string;
};

export type Respondent = {
  secretId: string;
  nickname: string;
  id: string;
};

export type SelectRespondentsProps = {
  reviewer: Reviewer;
  appletName: string;
  selectedRespondents: string[];
  respondents: Respondent[];
};

export type SelectRespondentsRef = {
  confirmSelection: () => string[];
};

export type ContentValue = {
  content: () => JSX.Element | string;
  value: string;
};
