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
