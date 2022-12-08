export type Breadcrumb = {
  icon: JSX.Element | string;
  label: string;
  navPath?: string;
  disabledLink?: boolean;
};

export type BreadcrumbsSchema = {
  data: Breadcrumb[] | null;
};
