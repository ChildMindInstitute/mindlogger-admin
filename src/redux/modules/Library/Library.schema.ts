import { BaseSchema } from '../Base';

export type PublishedApplet = {
  accountId: string;
  appletId: string;
  categoryId: string | null;
  description: string | null;
  id: string | null;
  image: string | null;
  keywords: string[];
  name: string;
  subCategoryId: string | null;
  version: string | null; // TODO: add a version to response
};

export type PublishedApplets = {
  data: PublishedApplet[];
  totalCount: number;
};

export type LibrarySchema = {
  publishedApplets: BaseSchema<PublishedApplets | null>;
};
