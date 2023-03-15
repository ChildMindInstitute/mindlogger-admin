import { ItemInputTypes } from 'shared/types';

export type ItemOption = {
  title: string;
  image?: string;
};

export type Item = {
  id: string;
  question: string;
  responseType: ItemInputTypes;
  options?: ItemOption[];
};

export type Activity = {
  id: string;
  name: string;
  items: Item[];
};

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
  version?: string | null; // TODO: add a version to response
  activities?: Activity[];
};

// TODO: move to api
export type PublishedAppletResponse = {
  data: PublishedApplet[];
  totalCount: number;
};
