import { SingleApplet } from 'redux/modules';

export type PopupProps = {
  readonly open: boolean;
  readonly applet: SingleApplet;
  readonly onClose: () => void;
  readonly updateAppletData: (applet: SingleApplet) => void;
};
