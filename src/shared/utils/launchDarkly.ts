import { LDClient } from 'launchdarkly-react-client-sdk';

import { PROHIBITED_PII_KEYS } from 'shared/hooks/useLaunchDarkly.const';

let _ldClient: LDClient;
let _userId: string;

export const LaunchDarkly = {
  async init(client: LDClient) {
    _ldClient = client;
  },
  async login(userId: string) {
    if (_ldClient) {
      _userId = userId;
      this.identify({
        userId,
      });
    }
  },
  async updateWorkspaces(workspaces: string[]) {
    if (_userId) {
      this.identify({
        userId: _userId,
        workspaces,
      });
    }
  },
  async identify(context: { userId?: string; workspaces?: string[] }) {
    if (PROHIBITED_PII_KEYS.some((val) => Object.keys(context).includes(val))) {
      throw new Error('Context contains prohibited keys');
    }
    if (_ldClient) {
      _ldClient?.identify(
        {
          ...context,
          kind: 'admin-users',
          key: `admin-users-${context.userId}`,
        },
        undefined,
      );
    }
  },
  async logout() {
    _userId = '';
    if (_ldClient) {
      _ldClient.identify({
        kind: 'user',
        anonymous: true,
      });
    }
  },
};
