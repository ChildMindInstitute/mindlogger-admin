export type Breadcrumb = {
  icon: JSX.Element | string;
  label: string;
  navPath?: string;
};

export type BreadcrumbsSchema = {
  data: Breadcrumb[] | null;
};
