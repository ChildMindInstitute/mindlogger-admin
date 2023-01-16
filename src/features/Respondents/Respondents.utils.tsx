import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';

import { Svg } from 'components';
import { FolderApplet, UserData, Users } from 'redux/modules';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import {
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
} from 'styles/styledComponents/AppletImage';
import { StyledBodyMedium, StyledLabelLarge } from 'styles/styledComponents/Typography';

import { Actions, ChosenAppletData } from './Respondents.types';

export const getActions = ({
  scheduleSetupAction,
  viewDataAction,
  userDataExportAction,
}: Actions) => [
  {
    icon: <Svg id="user-calendar" width={20} height={21} />,
    action: scheduleSetupAction,
    toolTipTitle: t('viewCalendar'),
  },
  {
    icon: <Svg id="data" width={22} height={22} />,
    action: viewDataAction,
    toolTipTitle: t('viewData'),
  },
  {
    icon: <Svg id="export" width={18} height={20} />,
    action: userDataExportAction,
    toolTipTitle: t('exportData'),
  },
  {
    icon: <Svg id="edit-access" width={21} height={19} />,
    action: (item: UserData) => item,
    toolTipTitle: t('editAccess'),
  },
  {
    icon: <Svg id="edit-user" width={21} height={22} />,
    action: (item: UserData) => item,
    toolTipTitle: t('editUser'),
  },
];

export const getChosenAppletData = (
  respondentsItems: Users,
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

  return { appletName, appletImg, secretUserId, nickName, hasIndividualSchedule };
};

export const getAppletsSmallTableRows = (
  respondentsItems: Users | undefined,
  appletsData: FolderApplet[],
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>,
) =>
  respondentsItems &&
  Object.keys(respondentsItems).map((key) => {
    const { appletName, appletImg, secretUserId, nickName, hasIndividualSchedule } =
      getChosenAppletData(respondentsItems, appletsData, key);
    const chosenAppletData = {
      appletId: key,
      appletName,
      secretUserId,
      hasIndividualSchedule,
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
