import { PublishedApplet } from 'redux/modules';

export enum AppletUiType {
  List = 'list',
  Details = 'details',
  Cart = 'cart',
}

export type AppletProps = {
  uiType?: AppletUiType;
  applet: PublishedApplet;
};

export type SelectedItem = {
  name: string;
  activityName: string;
};

export type LibraryForm = {
  [key: string]: SelectedItem[];
};
