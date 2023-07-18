import { AppletSchema } from './Applet.schema';

export const removeApplet = ({ applet }: AppletSchema): void => {
  if (applet.data) {
    applet.data = null;
  }
};

export const updateReportConfig = (
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
