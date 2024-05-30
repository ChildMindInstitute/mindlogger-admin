import { useCallback } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useTakeNowModal } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal';
import { Activity, ActivityFlow, workspaces } from 'redux/modules';
import { page } from 'resources';
import { MenuActionProps, MenuItemType, Svg } from 'shared/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import {
  checkIfCanAccessData,
  checkIfCanEdit,
  checkIfCanManageParticipants,
  checkIfCanTakeNow,
} from 'shared/utils';
import { RespondentDetails } from 'modules/Dashboard/types';

import { OpenTakeNowModalOptions } from '../TakeNowModal/TakeNowModal.types';

type FlowsMenuActionParams = MenuActionProps<{ appletId?: string; flowId?: string }>;

export function useFlowGridMenu({
  appletId,
  hasParticipants = false,
  testId = '',
  subject,
}: {
  appletId?: string;
  hasParticipants?: boolean;
  testId?: string;
  subject?: RespondentDetails;
}) {
  const { t } = useTranslation('app');
  const { TakeNowModal, openTakeNowModal } = useTakeNowModal({ dataTestId: testId });
  const { featureFlags } = useFeatureFlags();
  const navigate = useNavigate();
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;

  const canEdit = checkIfCanEdit(roles);
  const canDoTakeNow =
    checkIfCanTakeNow(roles) && featureFlags.enableMultiInformantTakeNow && hasParticipants;
  const canAccessData = checkIfCanAccessData(roles);
  const canAssign = checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;
  const showDivider = (canEdit || canAccessData) && (canAssign || canDoTakeNow);

  const getActionsMenu = useCallback(
    ({ flow }: { flow?: ActivityFlow }) => [
      {
        'data-testid': `${testId}-flow-edit`,
        action: ({ context }: FlowsMenuActionParams) => {
          if (context?.appletId && context?.flowId) {
            navigate(
              generatePath(page.builderAppletActivityFlowItemAbout, {
                appletId: context.appletId,
                activityFlowId: context.flowId,
              }),
            );
          }
        },
        context: { appletId, flowId: flow?.id },
        icon: <Svg id="edit" />,
        isDisplayed: canEdit,
        title: t('editFlow'),
      },
      {
        // TODO: Implement export data
        // https://mindlogger.atlassian.net/browse/M2-6039
        // https://mindlogger.atlassian.net/browse/M2-6736
        'data-testid': `${testId}-flow-export`,
        disabled: true,
        icon: <Svg id="export" />,
        title: t('exportData'),
        isDisplayed: canAccessData,
      },
      { type: MenuItemType.Divider, isDisplayed: showDivider },
      {
        // TODO: Implement assign
        // https://mindlogger.atlassian.net/browse/M2-5710
        'data-testid': `${testId}-flow-assign`,
        icon: <Svg id="add" />,
        title: t('assignActivity'),
        isDisplayed: canAssign,
      },
      {
        'data-testid': `${testId}-flow-take-now`,
        action: () => {
          if (flow) {
            const options: OpenTakeNowModalOptions | undefined = subject
              ? {
                  targetSubject: {
                    ...subject,
                    secretId: subject.secretUserId,
                    userId: subject.userId,
                  },
                }
              : undefined;
            // TODO: Fix this type :(
            openTakeNowModal(flow as unknown as Partial<Activity>, options);
          }
        },
        context: { appletId, flowId: flow?.id },
        icon: <Svg id="play-outline" />,
        isDisplayed: canDoTakeNow,
        title: t('takeNow.menuItem'),
      },
    ],
    [appletId, canDoTakeNow, canEdit, navigate, openTakeNowModal, subject, t, testId],
  );

  return {
    getActionsMenu,
    TakeNowModal,
  };
}
