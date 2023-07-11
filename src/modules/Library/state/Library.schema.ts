import { BaseSchema, Item } from 'redux/modules';

export type PublishedActivity = {
  key: string;
  name: string;
  description: Record<string, string>;
  image: string;
  splashScreen: '';
  showAllAtOnce: false;
  isSkippable: false;
  isReviewable: false;
  responseIsEditable: false;
  isHidden: false;
  items: Item[];
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
