export type ProlificApiToken = {
  apiToken: string;
};

export type ConfigurationPopupState =
  | {
      kind: 'idle';
    }
  | {
      kind: 'submitting';
    }
  | {
      kind: 'error';
      message: string;
    };
