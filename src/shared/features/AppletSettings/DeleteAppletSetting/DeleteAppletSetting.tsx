import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg, Tooltip } from 'shared/components';
import { StyledHeadlineLarge } from 'shared/styles/styledComponents';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const DeleteAppletSetting = ({ isDisabled = false }) => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const dispatch = useAppDispatch();

  return (
    <>
      <StyledHeadlineLarge>{t('deleteApplet')}</StyledHeadlineLarge>
      <StyledAppletSettingsDescription>{t('deleteDescription')}</StyledAppletSettingsDescription>
      <Tooltip tooltipTitle={isDisabled ? t('needToCreateApplet') : undefined}>
        <Box sx={{ width: 'fit-content' }}>
          <StyledAppletSettingsButton
            color="error"
            onClick={() =>
              dispatch(
                popups.actions.setPopupVisible({
                  appletId: id || '',
                  key: 'deletePopupVisible',
                  value: true,
                }),
              )
            }
            variant="outlined"
            startIcon={<Svg width="18" height="18" id="trash" />}
            disabled={isDisabled}
          >
            {t('deleteApplet')}
          </StyledAppletSettingsButton>
        </Box>
      </Tooltip>
    </>
  );
};
