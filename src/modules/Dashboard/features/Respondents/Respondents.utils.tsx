import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';

import { Row, Svg } from 'shared/components';
import {
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  StyledBodyMedium,
  StyledLabelLarge,
  StyledFlexTopCenter,
} from 'shared/styles';
import { RespondentDetail } from 'redux/modules';

import { RespondentsActions, ChosenAppletData } from './Respondents.types';

export const getActions = (
  {
    scheduleSetupAction,
    viewDataAction,
    removeAccessAction,
    userDataExportAction,
    editRespondent,
  }: RespondentsActions,
  appletId?: string,
) => [
  {
    icon: <Svg id="user-calendar" width={20} height={21} />,
    action: scheduleSetupAction,
    tooltipTitle: t('viewCalendar'),
  },
  {
    icon: <Svg id="data" width={22} height={22} />,
    action: viewDataAction,
    tooltipTitle: t('viewData'),
  },
  {
    icon: <Svg id="export" width={18} height={20} />,
    action: userDataExportAction,
    tooltipTitle: t('exportData'),
  },
  {
    icon: <Svg id="edit-user" width={21} height={19} />,
    action: editRespondent,
    tooltipTitle: t('editRespondent'),
    isDisplayed: !!appletId,
  },
  {
    icon: <Svg id="remove-access" />,
    action: removeAccessAction,
    tooltipTitle: t('removeAccess'),
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
    const { appletDisplayName, appletImg, respondentSecretId, respondentNickname } =
      respondentAccess;

    return {
      appletName: {
        content: () => (
          <StyledFlexTopCenter>
            {appletImg ? (
              <StyledSmallAppletImg src={appletImg} alt="Applet image" />
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
  }) as Row[] | undefined;
