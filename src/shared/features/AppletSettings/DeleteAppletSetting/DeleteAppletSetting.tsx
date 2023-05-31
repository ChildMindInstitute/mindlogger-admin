import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { page } from 'resources';
import { applet, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'shared/components';
import { DeletePopup } from 'modules/Dashboard/features/Applet/Popups';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const DeleteAppletSetting = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { deletePopupVisible } = popups.useData();
  const encryption = appletData?.encryption;

  const onCloseCallback = () => {
    navigate(page.dashboardApplets);
  };

  return (
    <>
      <StyledHeadline>{t('deleteApplet')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('deleteDescription')}</StyledAppletSettingsDescription>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          color="error"
          onClick={() =>
            dispatch(
              popups.actions.setPopupVisible({
                applet: appletData,
                encryption,
                key: 'deletePopupVisible',
                value: true,
              }),
            )
          }
          variant="outlined"
          startIcon={<Svg width="18" height="18" id="trash" />}
        >
          {t('deleteApplet')}
        </StyledAppletSettingsButton>
      </Box>
      {deletePopupVisible && <DeletePopup onCloseCallback={onCloseCallback} />}
    </>
  );
};
