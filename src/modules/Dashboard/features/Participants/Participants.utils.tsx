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
import { RespondentDetail, RespondentStatus } from 'modules/Dashboard/types';
import { HeadCell } from 'shared/types';
import i18n from 'i18n';
import { MenuItem, MenuItemType } from 'shared/components';
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
  dataTestid,
  invitation,
  firstName,
  lastName,
  subjectCreatedAt,
  showAssignActivity = false,
}: GetParticipantActionsProps): MenuItem<ParticipantActionProps>[] => {
  const context = {
    respondentId,
    respondentOrSubjectId,
    email,
    secretId,
    nickname,
    tag,
    invitation,
  };
  const isUpgradeable = status === RespondentStatus.NotInvited;
  const isPending = status === RespondentStatus.Pending;
  const isEditable = !!filteredApplets?.editable.length;
  const isViewable = !!filteredApplets?.viewable.length;

  let title = '';
  const emailAddress = email || invitation?.email;

  if (emailAddress) {
    title += `${i18n.t('email')}: ${emailAddress}`;
  }

  const hasInvitation = !!invitation;

  if (hasInvitation && invitation.firstName && invitation.lastName) {
    const fullName = `${i18n.t('fullName')}: ${invitation.firstName} ${invitation.lastName}`;
    title += title.length > 0 ? '\n' : '';
    title += fullName;
  } else if (!hasInvitation && firstName && lastName) {
    const fullName = `${i18n.t('fullName')}: ${firstName} ${lastName}`;
    title += title.length > 0 ? '\n' : '';
    title += fullName;
  }

  if (hasInvitation) {
    const invitationDate = `${i18n.t('invitationDate')}: ${format(
      new Date(invitation.createdAt),
      DateFormats.MonthDayYearTime,
    )}`;

    title += title.length > 0 ? '\n' : '';
    title += `${invitationDate}`;
  } else if (subjectCreatedAt) {
    const invitationDate = `${i18n.t('dateAdded')}: ${format(
      new Date(subjectCreatedAt),
      DateFormats.MonthDayYearTime,
    )}`;

    title += title.length > 0 ? '\n' : '';
    title += `${invitationDate}`;
  }

  const hasTitle = title.length > 0;

  return cleanUpDividers([
    { title, isDisplayed: hasTitle },
    {
      type: MenuItemType.Divider,
      isDisplayed: hasTitle,
    },
    {
      icon: <Svg id="duplicate" width={24} height={24} />,
      action: copyEmailAddress,
      title: t('copyEmailAddress'),
      context,
      isDisplayed: !!emailAddress && status !== RespondentStatus.Invited,
      'data-testid': `${dataTestid}-copy-email`,
    },
    {
      type: MenuItemType.Divider,
      isDisplayed: !!emailAddress && status !== RespondentStatus.Invited,
    },
    {
      icon: <Svg id="format-link" width={24} height={24} />,
      action: copyInvitationLink,
      title: t('copyInvitationLink'),
      context,
      isDisplayed: hasInvitation && isPending,
      'data-testid': `${dataTestid}-copy-invitation-link`,
    },
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
      isDisplayed: isViewable && !isPending,
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
      isDisplayed: showAssignActivity && !isPending,
    },
    {
      icon: <Svg id="add-users-outlined" width={24} height={24} />,
      action: assignActivity,
      title: t('assignActivity'),
      context,
      isDisplayed: showAssignActivity && isEditable && !isPending,
      'data-testid': `${dataTestid}-assign-activity`,
    },
  ]);
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
