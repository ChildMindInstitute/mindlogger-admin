import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { applet } from 'redux/modules';
import { Svg, Tooltip } from 'shared/components';
import { ShareApplet, OnAppletShared } from 'modules/Dashboard/features/Applet/ShareApplet';
import { SuccessSharePopup } from 'modules/Dashboard/features/Applet/Popups';

import { StyledButton, StyledContainer } from './ShareAppletSetting.styles';

export const ShareAppletSetting = ({ isDisabled: isDisabledSetting = false }) => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [libraryUrl, setLibraryUrl] = useState('');
  const [appletName, setAppletName] = useState('');

  const dataTestid = 'applet-settings-share-to-library';

  const handleAppletShared = ({ keywords, libraryUrl, appletName }: OnAppletShared) => {
    setKeywords(keywords);
    setLibraryUrl(libraryUrl);
    setSharePopupVisible(true);
    setAppletName(appletName);
  };

  useEffect(() => {
    if (!appletData) return;
    setAppletName(appletData.displayName);
  }, [appletData]);

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledContainer>
        <ShareApplet
          applet={appletData}
          onAppletShared={handleAppletShared}
          onDisableSubmit={isDisabled => setIsDisabled(isDisabled)}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          showSuccess={false}
          data-testid={dataTestid}
        />
        {appletData && (
          <SuccessSharePopup
            applet={{ ...appletData, displayName: appletName }}
            keywords={keywords}
            libraryUrl={libraryUrl}
            sharePopupVisible={sharePopupVisible}
            setSharePopupVisible={setSharePopupVisible}
            data-testid={`${dataTestid}-share-success-popup`}
          />
        )}
        <Tooltip tooltipTitle={isDisabled ? t('needToCreateApplet') : undefined}>
          <Box sx={{ width: 'fit-content' }}>
            <StyledButton
              variant="outlined"
              startIcon={<Svg width={18} height={18} id="share" />}
              disabled={isDisabled || isDisabledSetting}
              onClick={() => setIsSubmitted(true)}
              data-testid={`${dataTestid}-share`}>
              {t('share')}
            </StyledButton>
          </Box>
        </Tooltip>
      </StyledContainer>
    </Box>
  );
};
