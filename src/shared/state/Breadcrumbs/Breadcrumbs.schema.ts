export type Breadcrumb = {
  icon: string;
  label: string;
  navPath?: string;
  disabledLink?: boolean;
};

export type BreadcrumbsSchema = {
  data: Breadcrumb[] | null;
};
