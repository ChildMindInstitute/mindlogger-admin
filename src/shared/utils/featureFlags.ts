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
    this.identify({
      userId,
    });
  },
  async updateWorkspace(workspaceId: string) {
    if (!_userId) return;
    this.identify({
      userId: _userId,
      workspaceId,
    });
  },
  async identify(context: { userId?: string; workspaceId?: string }) {
    if (PROHIBITED_PII_KEYS.some((val) => Object.keys(context).includes(val))) {
      throw new Error('Context contains prohibited keys');
    }
    if (!_ldClient) return;
    _ldClient?.identify(
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
    _ldClient.identify({
      kind: 'user',
      anonymous: true,
    });
  },
};
