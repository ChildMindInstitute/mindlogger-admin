import { AppletSchema, UpdateActivityData, UpdateActivityFlowData } from './Applet.schema';
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

export const updateActivityData = (
  { applet }: AppletSchema,
  {
    payload,
  }: {
    payload: UpdateActivityData;
  },
): void => {
  const appletData = applet.data;

  if (appletData?.result) {
    appletData.result = {
      ...appletData.result,
      activities: appletData.result.activities?.map((activity) => ({
        ...activity,
        ...(activity.id === payload.activityId && {
          reportIncludedItemName: payload.reportIncludedItemName,
        }),
      })),
    };
  }
};

export const updateActivityFlowData = (
  { applet }: AppletSchema,
  {
    payload,
  }: {
    payload: UpdateActivityFlowData;
  },
): void => {
  const appletData = applet.data;

  if (appletData?.result) {
    appletData.result = {
      ...appletData.result,
      activityFlows: appletData.result.activityFlows?.map((activityFlow) => ({
        ...activityFlow,
        ...(activityFlow.id === payload.flowId && {
          reportIncludedItemName: payload.reportIncludedItemName,
          reportIncludedActivityName: payload.reportIncludedActivityName,
        }),
      })),
    };
  }
};
