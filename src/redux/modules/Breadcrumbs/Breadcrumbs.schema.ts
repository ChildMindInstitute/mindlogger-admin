export type Breadcrumb = {
  label: string;
  navPath: string;
};

export type BreadcrumbsSchema = {
  data: Breadcrumb[] | null;
};
