import { BaseSchema } from 'redux/modules';
import { ItemResponseType } from 'shared/consts';

export type PublishedItem = {
  question: Record<string, string>;
  responseType: ItemResponseType;
  responseValues: string[];
  order: number;
  name: string;
};

export type PublishedActivity = {
  name: string;
  items: PublishedItem[];
};

export type PublishedApplet = {
  id: string;
  version: string;
  displayName: string;
  keywords: string[];
  description: Record<string, string>;
  activities: PublishedActivity[];
  image?: string;
};

export type PublishedApplets = {
  result: PublishedApplet[];
  count: number;
};

export type LibrarySchema = {
  publishedApplets: BaseSchema<PublishedApplets>;
};
