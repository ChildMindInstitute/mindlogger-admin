export type Breadcrumb = {
  icon: string;
  label: string;
  chip?: string;
  navPath?: string;
  disabledLink?: boolean;
  hasUrl?: boolean;
  key?: string;
};

export type BreadcrumbsSchema = {
  data: Breadcrumb[] | null;
};
