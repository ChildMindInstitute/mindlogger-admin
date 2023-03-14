import { PublishedApplet } from '../AppletsCatalog/AppletsCatalog.types';

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
  id: string;
  activityId: string;
};

export type AppletForm = {
  [key: string]: SelectedItem[];
};
