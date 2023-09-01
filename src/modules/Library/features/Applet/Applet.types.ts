import { Dispatch, SetStateAction } from 'react';

import { PublishedApplet } from 'redux/modules';

export enum AppletUiType {
  List = 'list',
  Details = 'details',
  Cart = 'cart',
}

export type AppletProps = {
  uiType?: AppletUiType;
  applet: PublishedApplet;
  search?: string;
  setSearch?: Dispatch<SetStateAction<string>>;
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
