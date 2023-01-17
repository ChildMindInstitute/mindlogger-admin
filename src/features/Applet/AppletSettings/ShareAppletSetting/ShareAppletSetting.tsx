import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { folders } from 'redux/modules';
import { Svg } from 'components';
import { ShareApplet } from 'features/Applet/ShareApplet';
import { SuccessSharePopup } from 'features/Applet/Popups';

import { StyledButton, StyledContainer } from './ShareAppletSetting.styles';
import { StyledHeadline } from '../AppletSettings.styles';

export const ShareAppletSetting = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const applet = folders.useApplet(id as string);

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
      <StyledHeadline>{t('shareToLibrary')}</StyledHeadline>
      <StyledContainer>
        <ShareApplet
          applet={applet}
          onAppletShared={handleSharedApplet}
          onDisableSubmit={(isDisabled) => setIsDisabled(isDisabled)}
          isSubmitted={isSubmitted}
          showSuccess={false}
        />
        <SuccessSharePopup
          applet={applet}
          keywords={keywords}
          libraryUrl={libraryUrl}
          sharePopupVisible={sharePopupVisible}
          setSharePopupVisible={setSharePopupVisible}
        />
        <StyledButton
          variant="outlined"
          startIcon={<Svg width={18} height={18} id="share" />}
          disabled={isDisabled}
          onClick={() => setIsSubmitted(true)}
        >
          {t('share')}
        </StyledButton>
      </StyledContainer>
    </>
  );
};
