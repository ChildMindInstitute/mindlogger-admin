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
import { checkIfCanAccessData, checkIfCanManageParticipants } from 'shared/utils';

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
  const canManageParticipants = checkIfCanManageParticipants(roles);
  const isUpgradeable = status === RespondentStatus.NotInvited;
  const isPending = status === RespondentStatus.Pending;
  const isEditable = canManageParticipants && !!filteredApplets?.editable.length;
  const isViewable = !!filteredApplets?.viewable.length;
  const showEdit = !!appletId && isEditable && !isPending;
  const showUpgrade = isUpgradeable && isEditable;
  const showExport = checkIfCanAccessData(roles) && isViewable && !isPending;
  const showAssign = canManageParticipants && showAssignActivity && isEditable && !isPending;
  const showDivider = (showEdit || showUpgrade || showExport) && showAssign;

  return [
    {
      icon: <Svg id="edit" width={24} height={24} />,
      action: editParticipant,
      title: t('editParticipant'),
      context,
      isDisplayed: showEdit,
      'data-testid': `${dataTestid}-edit`,
    },
    {
      icon: <Svg id="full-account" width={24} height={24} />,
      action: upgradeAccount,
      title: t('upgradeToFullAccount'),
      context,
      isDisplayed: showUpgrade,
      'data-testid': `${dataTestid}-upgrade-account`,
    },
    {
      icon: <Svg id="export" width={24} height={24} />,
      action: exportData,
      title: t('exportData'),
      context,
      isDisplayed: showExport,
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
      isDisplayed: showDivider,
    },
    {
      icon: <Svg id="add-users-outlined" width={24} height={24} />,
      action: assignActivity,
      title: t('assignActivity'),
      context,
      isDisplayed: showAssign,
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

export const getHeadCells = (sortableColumns?: string[], appletId?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'pin',
      label: '',
      width: ParticipantsColumnsWidth.Pin,
    },
    {
      id: 'tags',
      label: t('tag'),
      enableSort: sortableColumns?.includes('tags') ?? true,
      width: ParticipantsColumnsWidth.Default,
    },
    {
      id: 'secretIds',
      label: t('secretUserId'),
      enableSort: sortableColumns?.includes('secretIds') ?? true,
      maxWidth: ParticipantsColumnsWidth.Id,
    },
    {
      id: 'nicknames',
      label: t('nickname'),
      enableSort: sortableColumns?.includes('nicknames') ?? true,
    },
    {
      id: 'status',
      label: t('accountType'),
      enableSort: sortableColumns?.includes('status') ?? true,
    },
    {
      id: 'lastSeen',
      label: t('latestActivity'),
      // API cannot currently sort by participants' latest activity because that field is
      // populated post-pagination. Sorting by this column is disabled until that can be fixed.
      enableSort: false,
    },
    ...(appletId
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
