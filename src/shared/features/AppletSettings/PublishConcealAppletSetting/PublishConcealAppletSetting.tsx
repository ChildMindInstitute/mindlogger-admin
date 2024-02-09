import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { PublishConcealAppletPopup } from 'modules/Dashboard/features/Applet/Popups';
import { applet, popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'shared/components/Svg';

import { StyledAppletSettingsButton, StyledAppletSettingsDescription } from '../AppletSettings.styles';
import { PublishConcealAppletSettingProps } from './PublishConcealAppletSetting.types';

export const PublishConcealAppletSetting = ({ isDashboard, isBuilder }: PublishConcealAppletSettingProps) => {
  const { t } = useTranslation('app');
  const { appletId = '' } = useParams();
  const dispatch = useAppDispatch();
  const { result: appletData } = applet.useAppletData() ?? {};
  const { getApplet } = applet.thunk;
  const { setValue, getValues } = useCustomFormContext() ?? {};

  const { publishConcealPopupVisible } = popups.useData();

  const isPublished = isBuilder ? getValues('isPublished') : appletData?.isPublished;

  const handleSuccess = () => {
    if (isDashboard) dispatch(getApplet({ appletId }));
    if (isBuilder) setValue('isPublished', !isPublished);
  };

  return (
    <>
      <StyledAppletSettingsDescription>
        {t(isPublished ? 'concealAppletDescription' : 'publishAppletDescription')}
      </StyledAppletSettingsDescription>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          onClick={() =>
            dispatch(
              popups.actions.setPopupVisible({
                applet: appletData,
                key: 'publishConcealPopupVisible',
                value: true,
                popupProps: { onSuccess: handleSuccess },
              }),
            )
          }
          variant="outlined"
          startIcon={<Svg width="18" height="18" id={isPublished ? 'conceal' : 'publish'} />}
          data-testid="applet-settings-publish-conceal-publish"
        >
          {t(isPublished ? 'concealApplet' : 'publishApplet')}
        </StyledAppletSettingsButton>
      </Box>
      {publishConcealPopupVisible && <PublishConcealAppletPopup />}
    </>
  );
};
