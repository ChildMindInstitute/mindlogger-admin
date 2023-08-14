import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { applet } from 'redux/modules';
import { Svg, Tooltip } from 'shared/components';
import { ShareApplet } from 'modules/Dashboard/features/Applet';
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

  const handleSharedApplet = ({
    keywords,
    libraryUrl,
  }: {
    keywords: string[];
    libraryUrl: string;
  }) => {
    setKeywords(keywords);
    setLibraryUrl(libraryUrl);
    setSharePopupVisible(true);
  };

  return (
    <>
      <StyledContainer>
        <ShareApplet
          applet={appletData}
          onAppletShared={handleSharedApplet}
          onDisableSubmit={(isDisabled) => setIsDisabled(isDisabled)}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          showSuccess={false}
        />
        {appletData && (
          <SuccessSharePopup
            applet={appletData}
            keywords={keywords}
            libraryUrl={libraryUrl}
            sharePopupVisible={sharePopupVisible}
            setSharePopupVisible={setSharePopupVisible}
          />
        )}
        <Tooltip tooltipTitle={isDisabled ? t('needToCreateApplet') : undefined}>
          <Box sx={{ width: 'fit-content' }}>
            <StyledButton
              variant="outlined"
              startIcon={<Svg width={18} height={18} id="share" />}
              disabled={isDisabled || isDisabledSetting}
              onClick={() => setIsSubmitted(true)}
            >
              {t('share')}
            </StyledButton>
          </Box>
        </Tooltip>
      </StyledContainer>
    </>
  );
};
