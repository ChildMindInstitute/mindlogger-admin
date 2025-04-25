import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';
import { format } from 'date-fns';

import { Svg } from 'shared/components/Svg';
import {
  StyledBodyMedium,
  StyledFlexTopCenter,
  StyledLabelLarge,
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  variables,
} from 'shared/styles';
import { ParticipantDetail, ParticipantStatus } from 'modules/Dashboard/types';
import { HeadCell } from 'shared/types';
import i18n from 'i18n';
import { MenuItem, MenuItemType } from 'shared/components';
import { checkIfCanAccessData, checkIfCanManageParticipants } from 'shared/utils';
import { DateFormats } from 'shared/consts';

import {
  ChosenAppletData,
  GetParticipantActionsProps,
  ParticipantActionProps,
} from './Participants.types';
import { ParticipantsColumnsWidth } from './Participants.const';

/**
 * Remove dividers that are not between normal displayed menu items
 */
export function cleanUpDividers(
  items: MenuItem<ParticipantActionProps>[],
): MenuItem<ParticipantActionProps>[] {
  let foundDisplayed = false;
  let prevDivider = false;
  let lastDisplayedIndex = -1;

  const result: MenuItem<ParticipantActionProps>[] = items.map((item, i) => {
    if (item.isDisplayed) {
      if (item.type === MenuItemType.Divider) {
        if (!foundDisplayed || prevDivider) {
          item.isDisplayed = false;
        }

        prevDivider = true;
      } else {
        foundDisplayed = true;
        prevDivider = false;
      }

      lastDisplayedIndex = i;
    }

    return item;
  });

  if (result.at(lastDisplayedIndex)?.type === MenuItemType.Divider) {
    result[lastDisplayedIndex].isDisplayed = false;
  }

  return result;
}

export const getParticipantActions = ({
  actions: {
    editParticipant,
    upgradeAccount,
    exportData,
    removeParticipant,
    assignActivity,
    copyEmailAddress,
    copyInvitationLink,
  },
  filteredApplets,
  respondentId,
  respondentOrSubjectId,
  appletId,
  email,
  secretId,
  nickname,
  tag,
  status,
  dataTestId,
  canAssignActivity,
  roles,
  invitation,
  firstName,
  lastName,
  subjectCreatedAt,
  teamMemberCanViewData,
}: GetParticipantActionsProps) => {
  const context = {
    respondentId,
    respondentOrSubjectId,
    email,
    secretId,
    nickname,
    tag,
    invitation,
  };
  const canManageParticipants = checkIfCanManageParticipants(roles);
  const isUpgradeable = status === ParticipantStatus.NotInvited;
  const isPending = status === ParticipantStatus.Pending;
  const isEditable = canManageParticipants && !!filteredApplets?.editable.length;
  const isViewable = !!filteredApplets?.viewable.length;
  const showEdit = !!appletId && isEditable && !isPending;
  const showUpgrade = isUpgradeable && isEditable;
  const showExport = checkIfCanAccessData(roles) && isViewable && !isPending;
  const showAssign = canManageParticipants && canAssignActivity && isEditable && !isPending;
  const showDivider = (showEdit || showUpgrade || showExport) && showAssign;

  const titleArr: string[] = [];
  const emailAddress = email || invitation?.email;

  if (emailAddress) {
    titleArr.push(`${i18n.t('email')}: ${emailAddress}`);
  }

  const hasInvitation = !!invitation;
  const dateFormat = `${DateFormats.MonthDayYear} '${t('lowercaseAt')}' ${DateFormats.Time}`;

  if (hasInvitation) {
    if (invitation.firstName && invitation.lastName) {
      titleArr.push(`${i18n.t('fullName')}: ${invitation.firstName} ${invitation.lastName}`);
    }

    titleArr.push(
      `${i18n.t('invitationDate')}: ${format(new Date(invitation.createdAt), dateFormat)}`,
    );
  } else {
    if (firstName && lastName) {
      titleArr.push(`${i18n.t('fullName')}: ${firstName} ${lastName}`);
    }

    if (subjectCreatedAt) {
      titleArr.push(`${i18n.t('dateAdded')}: ${format(new Date(subjectCreatedAt), dateFormat)}`);
    }
  }

  const title = titleArr.join('\n');
  const hasTitle = titleArr.length > 0;

  return cleanUpDividers([
    { type: MenuItemType.Info, title, isDisplayed: hasTitle },
    {
      type: MenuItemType.Divider,
      isDisplayed: hasTitle,
    },
    {
      icon: <Svg id="duplicate" width={24} height={24} />,
      action: copyEmailAddress,
      title: t('copyEmailAddress'),
      context,
      isDisplayed: !!emailAddress && status !== ParticipantStatus.Invited,
      'data-testid': `${dataTestId}-copy-email`,
    },
    {
      type: MenuItemType.Divider,
      isDisplayed: !!emailAddress && status !== ParticipantStatus.Invited,
    },
    {
      icon: <Svg id="format-link" width={24} height={24} />,
      action: copyInvitationLink,
      title: t('copyInvitationLink'),
      context,
      isDisplayed: hasInvitation && isPending,
      'data-testid': `${dataTestId}-copy-invitation-link`,
    },
    {
      icon: <Svg id="edit" width={24} height={24} />,
      action: editParticipant,
      title: t('editParticipant'),
      context,
      isDisplayed: showEdit,
      'data-testid': `${dataTestId}-edit`,
    },
    {
      icon: <Svg id="full-account" width={24} height={24} />,
      action: upgradeAccount,
      title: t('upgradeToFullAccount'),
      context,
      isDisplayed: showUpgrade,
      'data-testid': `${dataTestId}-upgrade-account`,
    },
    {
      icon: <Svg id="export" width={24} height={24} />,
      action: exportData,
      title: t('exportData'),
      context,
      isDisplayed: showExport,
      disabled: !teamMemberCanViewData,
      tooltip: teamMemberCanViewData ? '' : t('subjectDataUnavailable'),
      'data-testid': `${dataTestId}-export-data`,
    },
    {
      icon: <Svg id="remove-access" width={24} height={24} />,
      action: removeParticipant,
      title: t('removeParticipant'),
      context,
      isDisplayed: isEditable,
      customItemColor: variables.palette.dark_error_container,
      'data-testid': `${dataTestId}-remove`,
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
      'data-testid': `${dataTestId}-assign-activity`,
    },
  ]);
};

export const getAppletsSmallTableRows = (
  respondentAccesses: ParticipantDetail[],
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>,
  respondentId: string,
  ownerId: string,
) =>
  respondentAccesses?.map((respondentAccess) => {
    const choseAppletHandler = () =>
      setChosenAppletData({
        ...respondentAccess,
        ownerId,
        respondentId,
        createdAt: respondentAccess.subjectCreatedAt,
      });
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
      enableSort: sortableColumns?.includes('nicknames') ?? false,
    },
    {
      id: 'status',
      label: t('accountType'),
      enableSort: sortableColumns?.includes('status') ?? true,
    },
    {
      id: 'lastSeen',
      label: t('latestActivity'),
      enableSort: sortableColumns?.includes('lastSeen') ?? false,
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
