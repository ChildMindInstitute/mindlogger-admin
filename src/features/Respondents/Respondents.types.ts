export type Actions = {
  scheduleSetupAction: (value: number) => void;
};

export type ChosenAppletData = {
  appletId: string;
  appletName?: string;
  secretUserId?: string;
  hasIndividualSchedule?: boolean;
};
