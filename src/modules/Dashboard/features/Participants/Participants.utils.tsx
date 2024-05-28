import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import {
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  StyledBodyMedium,
  StyledLabelLarge,
  StyledFlexTopCenter,
  variables,
} from 'shared/styles';
import { RespondentDetail, RespondentStatus } from 'modules/Dashboard/types';
import { HeadCell } from 'shared/types';
import i18n from 'i18n';
import { MenuItemType } from 'shared/components';
import { checkIfCanAccessData, checkIfCanEdit } from 'shared/utils';

import { ChosenAppletData, GetParticipantActionsProps } from './Participants.types';
import { ParticipantsColumnsWidth } from './Participants.const';

export const getParticipantActions = ({
  actions: { editParticipant, upgradeAccount, exportData, removeParticipant, assignActivity },
  filteredApplets,
  respondentId,
  respondentOrSubjectId,
  appletId,
  email,
  secretId,
  nickname,
  tag,
  status,
  dataTestid,
  showAssignActivity = false,
  roles,
}: GetParticipantActionsProps) => {
  const context = { respondentId, respondentOrSubjectId, email, secretId, nickname, tag };
  const isUpgradeable = status === RespondentStatus.NotInvited;
  const isPending = status === RespondentStatus.Pending;
  const isEditable = !!filteredApplets?.editable.length;
  const isViewable = !!filteredApplets?.viewable.length;
  const canEdit = checkIfCanEdit(roles) && isViewable && !isPending;
  const canAccessData = checkIfCanAccessData(roles) && isViewable && !isPending;
  const showDivider = (isEditable || isUpgradeable || canAccessData) && canEdit;

  return [
    {
      icon: <Svg id="edit" width={24} height={24} />,
      action: editParticipant,
      title: t('editParticipant'),
      context,
      isDisplayed: !!appletId && isEditable && !isPending,
      'data-testid': `${dataTestid}-edit`,
    },
    {
      icon: <Svg id="full-account" width={24} height={24} />,
      action: upgradeAccount,
      title: t('upgradeToFullAccount'),
      context,
      isDisplayed: isUpgradeable && isEditable,
      'data-testid': `${dataTestid}-upgrade-account`,
    },
    {
      icon: <Svg id="export" width={24} height={24} />,
      action: exportData,
      title: t('exportData'),
      context,
      isDisplayed: canAccessData,
      'data-testid': `${dataTestid}-export-data`,
    },
    {
      icon: <Svg id="remove-access" width={24} height={24} />,
      action: removeParticipant,
      title: t('removeParticipant'),
      context,
      isDisplayed: isEditable,
      customItemColor: variables.palette.dark_error_container,
      'data-testid': `${dataTestid}-remove`,
    },
    {
      type: MenuItemType.Divider,
      isDisplayed: showAssignActivity && !isPending && showDivider,
    },
    {
      icon: <Svg id="add-users-outlined" width={24} height={24} />,
      action: assignActivity,
      title: t('assignActivity'),
      context,
      isDisplayed: showAssignActivity && isEditable && !isPending,
      'data-testid': `${dataTestid}-assign-activity`,
    },
  ];
};

export const getAppletsSmallTableRows = (
  respondentAccesses: RespondentDetail[],
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>,
  respondentId: string,
  ownerId: string,
) =>
  respondentAccesses?.map((respondentAccess) => {
    const choseAppletHandler = () =>
      setChosenAppletData({ ...respondentAccess, ownerId, respondentId });
    const { appletDisplayName, appletImage, respondentSecretId, respondentNickname } =
      respondentAccess;

    return {
      appletName: {
        content: () => (
          <StyledFlexTopCenter>
            {appletImage ? (
              <StyledSmallAppletImg src={appletImage} alt="Applet image" />
            ) : (
              <StyledSmallAppletImgPlaceholder />
            )}
            <StyledLabelLarge>{appletDisplayName}</StyledLabelLarge>
          </StyledFlexTopCenter>
        ),
        value: appletDisplayName,
        onClick: choseAppletHandler,
      },
      secretUserId: {
        content: () => <StyledLabelLarge>{respondentSecretId}</StyledLabelLarge>,
        value: respondentSecretId,
        onClick: choseAppletHandler,
      },
      nickname: {
        content: () => <StyledBodyMedium>{respondentNickname}</StyledBodyMedium>,
        value: respondentNickname,
        onClick: choseAppletHandler,
      },
    };
  });

export const getHeadCells = (id?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'pin',
      label: '',
      width: ParticipantsColumnsWidth.Pin,
    },
    {
      id: 'tag',
      label: t('tag'),
      enableSort: true,
      width: ParticipantsColumnsWidth.Default,
    },
    {
      id: 'secretIds',
      label: t('secretUserId'),
      enableSort: true,
      maxWidth: ParticipantsColumnsWidth.Id,
    },
    {
      id: 'nicknames',
      label: t('nickname'),
      enableSort: true,
    },
    {
      id: 'accountType',
      label: t('accountType'),
      enableSort: true,
    },
    {
      id: 'lastSeen',
      label: t('latestActivity'),
      enableSort: true,
    },
    ...(id
      ? [
          {
            id: 'schedule',
            label: t('schedule'),
          },
        ]
      : []),
    {
      id: 'actions',
      label: '',
      width: ParticipantsColumnsWidth.Pin,
    },
  ];
};
