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

import { ChosenAppletData, GetMenuItems } from './Respondents.types';
import { RespondentsColumnsWidth } from './Respondents.const';

export const getRespondentActions = ({
  actions: {
    scheduleSetupAction,
    viewDataAction,
    removeAccessAction,
    userDataExportAction,
    editRespondent,
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
    'data-testid': 'dashboard-respondents-view-calendar',
  },
  {
    icon: <Svg id="data" width={22} height={22} />,
    action: viewDataAction,
    title: t('viewData'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: !!filteredApplets?.viewable.length,
    'data-testid': 'dashboard-respondents-view-data',
  },
  {
    icon: <Svg id="export2" width={20} height={21} />,
    action: userDataExportAction,
    title: t('exportData'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: !!filteredApplets?.viewable.length,
    'data-testid': 'dashboard-respondents-export-data',
  },
  {
    icon: <Svg id="edit" width={22} height={21} />,
    action: editRespondent,
    title: t('editRespondent'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: !!appletId && !!filteredApplets?.editable.length,
    'data-testid': 'dashboard-respondents-edit',
  },
  {
    icon: <Svg id="remove-from-folder" width={21} height={21} />,
    action: sendInvitation,
    title: t('sendInvitation'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: isInviteEnabled && !!filteredApplets?.editable.length,
    'data-testid': 'dashboard-respondents-invite',
  },
  {
    icon: <Svg id="trash" width={21} height={21} />,
    action: removeAccessAction,
    title: t('removeFromApplet'),
    context: { respondentId, respondentOrSubjectId, email },
    isDisplayed: !!filteredApplets?.editable.length,
    customItemColor: variables.palette.dark_error_container,
    'data-testid': 'dashboard-respondents-remove-access',
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
      id: 'pin',
      label: '',
      enableSort: true,
      width: RespondentsColumnsWidth.Pin,
    },
    {
      id: 'secretIds',
      label: t('secretUserId'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    {
      id: 'nicknames',
      label: t('nickname'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    {
      id: 'lastSeen',
      label: t('lastActive'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    ...(id
      ? [
          {
            id: 'schedule',
            label: t('schedule'),
            width: RespondentsColumnsWidth.Schedule,
          },
        ]
      : []),
    { id: 'status', label: '', width: RespondentsColumnsWidth.Status },
    {
      id: 'actions',
      label: t('actions'),
    },
  ];
};
