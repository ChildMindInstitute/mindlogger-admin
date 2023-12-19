import { Tab } from 'shared/components/Tabs/Tabs.types';

export type GetActivityFlowTabs = {
  (
    params: { appletId?: string; activityFlowId?: string },
    tabErrors: { hasAboutActivityFlowErrors: boolean; hasActivityFlowBuilderErrors: boolean },
  ): Tab[];
};
