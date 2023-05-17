import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { applet, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'shared/components';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const PublishConcealAppletSetting = ({ isDashboard = true }: { isDashboard?: boolean }) => {
  const { t } = useTranslation('app');
  const { appletId = '' } = useParams();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { getApplet } = applet.thunk;
  const { isPublished } = appletData ?? {};

  const handleSubmit = () => {
    console.log('success');
    dispatch(getApplet({ appletId }));
  };

  return (
    <>
      <StyledHeadline>{t(isPublished ? 'concealApplet' : 'publishApplet')}</StyledHeadline>
      <StyledAppletSettingsDescription>
        {t(isPublished ? 'concealAppletDescription' : 'publishAppletDescription')}
      </StyledAppletSettingsDescription>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          onClick={() =>
            dispatch(
              popups.actions.setPopupVisible({
                appletId,
                key: 'publishConcealPopupVisible',
                value: true,
                popupProps: { onSuccess: handleSubmit },
              }),
            )
          }
          variant="outlined"
          startIcon={<Svg width="18" height="18" id={isPublished ? 'conceal' : 'publish'} />}
        >
          {t(isPublished ? 'concealApplet' : 'publishApplet')}
        </StyledAppletSettingsButton>
      </Box>
    </>
  );
};
