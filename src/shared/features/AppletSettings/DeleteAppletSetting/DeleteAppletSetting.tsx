import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { page } from 'resources';
import { applet, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'shared/components/Svg';
import { DeletePopup } from 'modules/Dashboard/features/Applet/Popups';

import { StyledAppletSettingsButton, StyledAppletSettingsDescription } from '../AppletSettings.styles';

export const DeleteAppletSetting = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { deletePopupVisible } = popups.useData();

  const dataTestid = 'applet-settings-delete-applet';

  const onCloseCallback = () => {
    navigate(page.dashboardApplets);
  };

  return (
    <>
      <StyledAppletSettingsDescription>{t('deleteDescription')}</StyledAppletSettingsDescription>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          color="error"
          onClick={() =>
            dispatch(
              popups.actions.setPopupVisible({
                applet: appletData,
                key: 'deletePopupVisible',
                value: true,
              }),
            )
          }
          variant="outlined"
          startIcon={<Svg width="18" height="18" id="trash" />}
          data-testid={`${dataTestid}-delete-button`}>
          {t('deleteApplet')}
        </StyledAppletSettingsButton>
      </Box>
      {deletePopupVisible && <DeletePopup onCloseCallback={onCloseCallback} data-testid={`${dataTestid}-delete`} />}
    </>
  );
};
