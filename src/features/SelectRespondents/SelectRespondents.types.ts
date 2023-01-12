export type Reviewer = {
  name: string;
  email: string;
};

export type Respondent = {
  secretId: string;
  nickname: string;
};

export type SelectRespondentsProps = {
  reviewer: Reviewer;
  appletName: string;
  selectedRespondents: string[];
  respondents: Respondent[];
};
