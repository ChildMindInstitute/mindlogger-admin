import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';

import { Svg } from 'shared/components';
import { FolderApplet } from 'redux/modules';
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

export const getChosenAppletData = (
  respondentsItems: any, // TODO: fix later
  appletsData: FolderApplet[],
  appletId: string,
) => {
  const applet = appletsData.find((applet) => applet.id === appletId);
  const appletName = applet?.name || '';
  const appletImg = applet?.image || '';
  const respondentItem = respondentsItems[appletId];
  const secretUserId = respondentItem.MRN;
  const nickName = respondentItem.nickName;
  const hasIndividualSchedule = respondentItem.hasIndividualEvent;
  const userId = respondentItem['_id'];

  return { appletName, appletImg, secretUserId, nickName, hasIndividualSchedule, userId };
};

export const getAppletsSmallTableRows = (
  respondentsItems: any, // TODO: fix later
  appletsData: FolderApplet[],
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>,
) =>
  respondentsItems &&
  Object.keys(respondentsItems).map((key) => {
    const { appletName, appletImg, secretUserId, nickName, hasIndividualSchedule, userId } =
      getChosenAppletData(respondentsItems, appletsData, key);
    const chosenAppletData = {
      appletId: key,
      appletName,
      secretUserId,
      hasIndividualSchedule,
      userId,
    };

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
        content: () => <StyledBodyMedium>{nickName}</StyledBodyMedium>,
        value: nickName,
        onClick: () => setChosenAppletData(chosenAppletData),
      },
    };
  });
