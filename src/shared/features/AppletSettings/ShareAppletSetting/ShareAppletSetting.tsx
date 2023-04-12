import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { Svg, Tooltip } from 'shared/components';
import { ShareApplet } from 'modules/Dashboard/features/Applet';
import { SuccessSharePopup } from 'modules/Dashboard/features/Applet/Popups';
import { folders } from 'modules/Dashboard/state';

import { StyledButton, StyledContainer } from './ShareAppletSetting.styles';
import { StyledHeadline } from '../AppletSettings.styles';

export const ShareAppletSetting = ({ isDisabled: isDisabledSetting = false }) => {
  const { t } = useTranslation('app');
  const { appletId: id } = useParams();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [libraryUrl, setLibraryUrl] = useState('');

  const applet = id ? folders.useApplet(id) : undefined;

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
      <StyledHeadline>{t('shareToLibrary')}</StyledHeadline>
      <StyledContainer>
        <ShareApplet
          applet={applet}
          onAppletShared={handleSharedApplet}
          onDisableSubmit={(isDisabled) => setIsDisabled(isDisabled)}
          isSubmitted={isSubmitted}
          showSuccess={false}
        />
        {applet && (
          <SuccessSharePopup
            applet={applet}
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
