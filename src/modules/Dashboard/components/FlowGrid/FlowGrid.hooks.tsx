import { useCallback } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useTakeNowModal } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal';
import { workspaces } from 'redux/modules';
import { page } from 'resources';
import { MenuActionProps, MenuItemType, Svg } from 'shared/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import {
  checkIfCanAccessData,
  checkIfCanEdit,
  checkIfCanManageParticipants,
  checkIfFullAccess,
  getIsWebSupported,
} from 'shared/utils';
import { RespondentDetails } from 'modules/Dashboard/types';
import { ItemResponseType } from 'shared/consts';

import { HydratedActivityFlow } from './FlowGrid.types';
import { OpenTakeNowModalOptions } from '../TakeNowModal/TakeNowModal.types';

type FlowsMenuActionParams = MenuActionProps<{ appletId?: string; flowId?: string }>;

export function useFlowGridMenu({
  appletId,
  hasParticipants = false,
  testId = '',
  subject,
  onClickExportData,
}: {
  appletId?: string;
  hasParticipants?: boolean;
  testId?: string;
  onClickExportData?: (flowId: string) => void;
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
    checkIfFullAccess(roles) && featureFlags.enableMultiInformantTakeNow && hasParticipants;
  const canAccessData = checkIfCanAccessData(roles);
  const canAssign = checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;
  const showDivider = (canEdit || canAccessData) && (canAssign || canDoTakeNow);

  const getActionsMenu = useCallback(
    ({ flow }: { flow: HydratedActivityFlow }) => {
      const flowItems = flow.activities.reduce<{ responseType: ItemResponseType }[]>(
        (items, activity) => [...items, ...activity.items],
        [],
      );
      const isWebUnsupported = !getIsWebSupported(flowItems);

      return [
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
          'data-testid': `${testId}-flow-export`,
          action: () => {
            if (flow?.id) {
              onClickExportData?.(flow?.id);
            }
          },
          disabled: !flow?.id,
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
            const options: OpenTakeNowModalOptions | undefined = subject
              ? {
                  targetSubject: {
                    ...subject,
                    secretId: subject.secretUserId,
                    userId: subject.userId,
                  },
                }
              : undefined;
            openTakeNowModal(flow, options);
          },
          context: { appletId, flowId: flow?.id },
          icon: <Svg id="play-outline" />,
          isDisplayed: canDoTakeNow,
          title: t('takeNow.menuItem'),
          disabled: isWebUnsupported,
          tooltip: isWebUnsupported && t('activityIsMobileOnly'),
        },
      ];
    },
    [
      appletId,
      canAccessData,
      canAssign,
      canDoTakeNow,
      canEdit,
      navigate,
      onClickExportData,
      openTakeNowModal,
      showDivider,
      subject,
      t,
      testId,
    ],
  );

  return {
    getActionsMenu,
    TakeNowModal,
  };
}
