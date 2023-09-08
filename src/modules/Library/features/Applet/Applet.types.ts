import { Item, PublishedActivity, PublishedApplet } from 'redux/modules';

export enum AppletUiType {
  List = 'list',
  Details = 'details',
  Cart = 'cart',
}

export type AppletProps = {
  uiType?: AppletUiType;
  applet: PublishedApplet;
  search?: string;
  setSearch?: (value: string) => void;
  'data-testid'?: string;
};

export type SelectedItem = {
  itemNamePlusActivityName: string;
  activityNamePlusId: string;
  activityName: string;
  activityKey: string;
};

export type LibraryForm = {
  [key: string]: SelectedItem[];
};

export type ExpandedItem = Item & { expanded?: boolean };

export type ExpandedActivity = PublishedActivity & { items: ExpandedItem[]; expanded?: boolean };
