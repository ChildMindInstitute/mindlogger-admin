import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';

import { Row, Svg } from 'shared/components';
import {
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  StyledBodyMedium,
  StyledLabelLarge,
  StyledFlexTopCenter,
} from 'shared/styles/styledComponents';

import { RespondentsActions, ChosenAppletData } from './Respondents.types';

export const getActions = ({
  scheduleSetupAction,
  viewDataAction,
  removeAccessAction,
  userDataExportAction,
  editRespondent,
}: RespondentsActions) => [
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
  },
  {
    icon: <Svg id="remove-access" />,
    action: removeAccessAction,
    tooltipTitle: t('removeAccess'),
  },
];

export const getChosenAppletData = (respondentAccess: ChosenAppletData, respondentId?: string) => ({
  ...respondentAccess,
  respondentId,
});

export const getAppletsSmallTableRows = (
  respondentAccesses: ChosenAppletData[] | null,
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>,
  userId?: string,
) =>
  respondentAccesses?.map((respondentAccess) => {
    const chosenAppletData = getChosenAppletData(respondentAccess, userId);
    const { appletName, appletImg, secretUserId, nickname } = chosenAppletData;

    return {
      appletName: {
        content: () => (
          <StyledFlexTopCenter>
            {appletImg ? (
              <StyledSmallAppletImg src={appletImg} alt="Applet image" />
            ) : (
              <StyledSmallAppletImgPlaceholder />
            )}
            <StyledLabelLarge>{appletName}</StyledLabelLarge>
          </StyledFlexTopCenter>
        ),
        value: appletName,
        onClick: () => setChosenAppletData(chosenAppletData),
      },
      secretUserId: {
        content: () => <StyledLabelLarge>{secretUserId}</StyledLabelLarge>,
        value: secretUserId,
        onClick: () => setChosenAppletData(chosenAppletData),
      },
      nickname: {
        content: () => <StyledBodyMedium>{nickname}</StyledBodyMedium>,
        value: nickname,
        onClick: () => setChosenAppletData(chosenAppletData),
      },
    };
  }) as Row[] | undefined;
