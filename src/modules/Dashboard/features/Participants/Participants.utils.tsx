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
import { RespondentDetail } from 'modules/Dashboard/types';
import { HeadCell } from 'shared/types';
import i18n from 'i18n';

import { ChosenAppletData, GetMenuItems } from './Participants.types';
import { ParticipantsColumnsWidth } from './Participants.const';
import { StyledCheckBox } from './Participants.styles';

export const getParticipantActions = ({
  actions: {
    scheduleSetupAction,
    viewDataAction,
    removeAccessAction,
    userDataExportAction,
    editParticipant,
    sendInvitation,
  },
  filteredApplets,
  respondentId,
  respondentOrSubjectId,
  appletId,
  email,
  isInviteEnabled,
  isViewCalendarEnabled,
}: GetMenuItems) => [
  {
    icon: <Svg id="calendar" width={20} height={21} />,
    action: scheduleSetupAction,
    title: t('viewCalendar'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: isViewCalendarEnabled && !!filteredApplets?.scheduling.length,
    'data-testid': 'dashboard-participants-view-calendar',
  },
  {
    icon: <Svg id="data" width={22} height={22} />,
    action: viewDataAction,
    title: t('viewData'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: !!filteredApplets?.viewable.length,
    'data-testid': 'dashboard-participants-view-data',
  },
  {
    icon: <Svg id="export2" width={20} height={21} />,
    action: userDataExportAction,
    title: t('exportData'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: !!filteredApplets?.viewable.length,
    'data-testid': 'dashboard-participants-export-data',
  },
  {
    icon: <Svg id="edit" width={22} height={21} />,
    action: editParticipant,
    title: t('editParticipant'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: !!appletId && !!filteredApplets?.editable.length,
    'data-testid': 'dashboard-participants-edit',
  },
  {
    icon: <Svg id="remove-from-folder" width={21} height={21} />,
    action: sendInvitation,
    title: t('sendInvitation'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: isInviteEnabled && !!filteredApplets?.editable.length,
    'data-testid': 'dashboard-participants-invite',
  },
  {
    icon: <Svg id="trash" width={21} height={21} />,
    action: removeAccessAction,
    title: t('removeFromApplet'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: !!filteredApplets?.editable.length,
    customItemColor: variables.palette.dark_error_container,
    'data-testid': 'dashboard-participants-remove-access',
  },
];

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
      id: 'checkbox',
      label: (
        <StyledCheckBox>
          <Svg id="checkbox-empty-outline" height="20" width="20" />
        </StyledCheckBox>
      ),
      enableSort: true,
      width: ParticipantsColumnsWidth.Pin,
    },
    {
      id: 'pin',
      label: '',
      enableSort: true,
      width: ParticipantsColumnsWidth.Pin,
    },
    {
      id: 'secretIds',
      label: t('secretUserId'),
      enableSort: true,
      width: ParticipantsColumnsWidth.Default,
    },
    {
      id: 'nicknames',
      label: t('nickname'),
      enableSort: true,
      width: ParticipantsColumnsWidth.Default,
    },
    {
      id: 'tags',
      label: t('tag'),
      enableSort: true,
      width: ParticipantsColumnsWidth.Default,
    },
    {
      id: 'accountType',
      label: t('accountType'),
      enableSort: true,
      width: ParticipantsColumnsWidth.AccountType,
    },
    {
      id: 'lastSeen',
      label: t('latestActivity'),
      enableSort: true,
      width: ParticipantsColumnsWidth.Default,
    },
    ...(id
      ? [
          {
            id: 'schedule',
            label: t('schedule'),
            width: ParticipantsColumnsWidth.Schedule,
          },
        ]
      : []),
    {
      id: 'actions',
      label: '',
    },
  ];
};
