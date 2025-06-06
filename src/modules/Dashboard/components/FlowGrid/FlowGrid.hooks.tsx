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
import { ItemResponseType } from 'shared/consts';
import { AssignedHydratedActivityFlow } from 'modules/Dashboard/types';

import { UseFlowGridMenuProps } from './FlowGrid.types';
import { OpenTakeNowModalOptions } from '../TakeNowModal/TakeNowModal.types';

type FlowsMenuActionParams = MenuActionProps<{ appletId?: string; flowId?: string }>;

export function useFlowGridMenu({
  appletId,
  hasParticipants = false,
  testId = '',
  subject,
  onClickExportData,
  onClickAssign,
  onClickUnassign,
}: UseFlowGridMenuProps) {
  const { t } = useTranslation('app');
  const { TakeNowModal, openTakeNowModal } = useTakeNowModal({ dataTestId: testId });
  const { featureFlags } = useFeatureFlags();
  const navigate = useNavigate();
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;

  const canEdit = checkIfCanEdit(roles);
  const canDoTakeNow = checkIfFullAccess(roles) && hasParticipants;
  const canAccessData = checkIfCanAccessData(roles);
  const canAssign = checkIfCanManageParticipants(roles) && featureFlags.enableActivityAssign;
  const showDivider = (canEdit || canAccessData || canAssign) && canDoTakeNow;

  const getActionsMenu = useCallback(
    ({ flow }: { flow: AssignedHydratedActivityFlow }) => {
      const { id: flowId, autoAssign } = flow;
      const flowItems = flow.activities.reduce<{ responseType: ItemResponseType }[]>(
        (items, activity) => [...items, ...activity.items],
        [],
      );
      const isAssigned = !!flow.assignments?.some(
        (a) => a.respondentSubject.id === subject?.id || a.targetSubject.id === subject?.id,
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
          context: { appletId, flowId },
          icon: <Svg id="edit" />,
          isDisplayed: canEdit,
          title: t('editFlow'),
        },
        {
          'data-testid': `${testId}-flow-export`,
          action: () => {
            if (flowId) onClickExportData(flowId);
          },
          disabled: !flowId,
          icon: <Svg id="export" />,
          title: t('exportData'),
          isDisplayed: canAccessData,
        },
        {
          'data-testid': `${testId}-flow-assign`,
          action: () => {
            if (flowId) onClickAssign(flowId);
          },
          icon: <Svg id="file-plus" />,
          title: t('assignFlow'),
          isDisplayed: canAssign && !autoAssign,
        },
        {
          'data-testid': `${testId}-flow-unassign`,
          action: () => {
            if (flowId) onClickUnassign?.(flowId);
          },
          icon: <Svg id="clear-calendar" />,
          title: t('unassignFlow'),
          isDisplayed: canAssign && (autoAssign || isAssigned),
          disabled: autoAssign,
          tooltip: autoAssign && t('unassignFlowDisabledTooltip'),
        },
        { type: MenuItemType.Divider, isDisplayed: showDivider },
        {
          'data-testid': `${testId}-flow-take-now`,
          action: () => {
            const options: OpenTakeNowModalOptions | undefined = subject
              ? {
                  targetSubject: {
                    ...subject,
                    secretId: subject.secretUserId,
                    userId: subject.userId,
                    isTeamMember: subject.tag === 'Team',
                    roles: subject.roles,
                  },
                }
              : undefined;
            openTakeNowModal(flow, options);
          },
          context: { appletId, flowId },
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
      onClickAssign,
      onClickExportData,
      onClickUnassign,
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
