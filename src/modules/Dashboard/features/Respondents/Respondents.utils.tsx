import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import {
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  StyledBodyMedium,
  StyledLabelLarge,
  StyledFlexTopCenter,
} from 'shared/styles';
import { RespondentDetail } from 'modules/Dashboard/types';

import { RespondentsActions, ChosenAppletData, FilteredApplets } from './Respondents.types';

export const getActions = (
  { scheduleSetupAction, viewDataAction, removeAccessAction, userDataExportAction, editRespondent }: RespondentsActions,
  filteredApplets: FilteredApplets,
  isAnonymousRespondent: boolean,
  appletId?: string,
) => [
  {
    icon: <Svg id="user-calendar" width={20} height={21} />,
    action: scheduleSetupAction,
    tooltipTitle: t('viewCalendar'),
    isDisplayed: !isAnonymousRespondent && !!filteredApplets?.scheduling.length,
    'data-testid': 'dashboard-respondents-view-calendar',
  },
  {
    icon: <Svg id="data" width={22} height={22} />,
    action: viewDataAction,
    tooltipTitle: t('viewData'),
    isDisplayed: !!filteredApplets?.viewable.length,
    'data-testid': 'dashboard-respondents-view-data',
  },
  {
    icon: <Svg id="export" width={18} height={20} />,
    action: userDataExportAction,
    tooltipTitle: t('exportData'),
    isDisplayed: !!filteredApplets?.viewable.length,
    'data-testid': 'dashboard-respondents-export-data',
  },
  {
    icon: <Svg id="edit-user" width={21} height={19} />,
    action: editRespondent,
    tooltipTitle: t('editRespondent'),
    isDisplayed: !!appletId && !!filteredApplets?.editable.length,
    'data-testid': 'dashboard-respondents-edit',
  },
  {
    icon: <Svg id="remove-access" />,
    action: removeAccessAction,
    tooltipTitle: t('removeAccess'),
    isDisplayed: !!filteredApplets?.editable.length,
    'data-testid': 'dashboard-respondents-remove-access',
  },
];

export const getAppletsSmallTableRows = (
  respondentAccesses: RespondentDetail[],
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>,
  respondentId: string,
  ownerId: string,
) =>
  respondentAccesses?.map(respondentAccess => {
    const choseAppletHandler = () => setChosenAppletData({ ...respondentAccess, ownerId, respondentId });
    const { appletDisplayName, appletImage, respondentSecretId, respondentNickname } = respondentAccess;

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
