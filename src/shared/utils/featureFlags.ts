import { LDClient } from 'launchdarkly-react-client-sdk';

import { PROHIBITED_PII_KEYS } from 'shared/hooks/useFeatureFlags.const';

let _ldClient: LDClient;
let _userId: string;

export const FeatureFlags = {
  async init(client: LDClient) {
    _ldClient = client;
  },
  async login(userId: string) {
    if (!_ldClient) return;
    _userId = userId;

    return this.identify({
      userId,
    });
  },
  async updateWorkspaces(workspaces: string[], workspaceId: string) {
    if (!_userId) return;

    return this.identify({
      userId: _userId,
      workspaces,
      workspaceId,
    });
  },
  async identify(context: { userId?: string; workspaces?: string[]; workspaceId?: string }) {
    if (PROHIBITED_PII_KEYS.some((val) => Object.keys(context).includes(val))) {
      throw new Error('Context contains prohibited keys');
    }
    if (!_ldClient) return;

    return _ldClient?.identify(
      {
        ...context,
        kind: 'admin-users',
        key: `admin-users-${context.userId}`,
      },
      undefined,
    );
  },
  async logout() {
    _userId = '';
    if (!_ldClient) return;

    return _ldClient.identify({
      kind: 'user',
      anonymous: true,
    });
  },
};
