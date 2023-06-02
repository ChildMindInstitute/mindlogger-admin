import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { page } from 'resources';
import { applet, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'shared/components';
import { DuplicatePopups } from 'modules/Dashboard/features/Applet/Popups';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const DuplicateAppletSettings = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { duplicatePopupsVisible } = popups.useData();
  const { result: appletData } = applet.useAppletData() ?? {};
  const dispatch = useAppDispatch();

  const onCloseCallback = () => {
    navigate(page.dashboardApplets);
  };

  return (
    <>
      <StyledHeadline>{t('duplicateApplet')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('duplicateDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="duplicate" />}
        onClick={() =>
          dispatch(
            popups.actions.setPopupVisible({
              applet: appletData,
              key: 'duplicatePopupsVisible',
              value: true,
            }),
          )
        }
      >
        {t('duplicate')}
      </StyledAppletSettingsButton>
      {duplicatePopupsVisible && <DuplicatePopups onCloseCallback={onCloseCallback} />}
    </>
  );
};
