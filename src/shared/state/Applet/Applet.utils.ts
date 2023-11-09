import { AppletSchema } from './Applet.schema';
import { state as initialState } from './Applet.state';

export const resetApplet = (state: AppletSchema): void => {
  state.applet = initialState.applet;
};

export const removeApplet = ({ applet }: AppletSchema): void => {
  if (applet.data) {
    applet.data = null;
  }
};

export const updateAppletData = (
  { applet }: AppletSchema,
  {
    payload,
  }: {
    payload: Record<string, unknown>;
  },
): void => {
  if (applet.data?.result) {
    applet.data.result = {
      ...applet.data.result,
      ...payload,
    };
  }
};
