import { DropdownToolbar, InsertContentGenerator } from 'md-editor-rt';
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SourceLinkModalForm } from 'shared/components/MarkDownEditor/SourceLinkModal';
import { Svg } from 'shared/components/Svg';
import { StyledFlexColumn, StyledTitleSmall } from 'shared/styles';
import { ALLOWED_AUDIO_FILE_TYPES, MediaType } from 'shared/consts';

import { StyledIconCenter, StyledMenuItem, StyledMenuList } from '../Extensions.styles';
import { SourceLinkModal } from '../../SourceLinkModal';
import { useUploadMethods } from '../Extensions.hooks';
import { MediaContentExtensionProps } from '../Extensions.types';

export const AudioUploadExtension = ({
  onInsert,
  setFileSizeExceeded,
  fileSizeExceeded,
  setIncorrectFormat,
  setIsLoading,
}: MediaContentExtensionProps) => {
  const { t } = useTranslation('app');
  const insertHandler = ({ label, address }: SourceLinkModalForm) => {
    const generator: InsertContentGenerator = () => ({
      targetValue: `![${label}](${address})`,
      select: false,
      deviationStart: 0,
      deviationEnd: 0,
    });

    onInsert(generator);
  };
  const {
    isVisible,
    setIsVisible,
    isPopupVisible,
    handlePopupSubmit,
    handlePopupClose,
    onAddLinkClick,
    onUploadClick,
    onInputChange,
    inputRef,
  } = useUploadMethods({
    insertHandler,
    setFileSizeExceeded,
    fileSizeExceeded,
    setIncorrectFormat,
    type: MediaType.Audio,
    setIsLoading,
  });

  return (
    <>
      <DropdownToolbar
        visible={isVisible}
        onChange={setIsVisible}
        overlay={
          <StyledFlexColumn>
            <Paper>
              <StyledMenuList>
                <StyledMenuItem onClick={onAddLinkClick}>
                  <StyledTitleSmall>{t('audioLink')} </StyledTitleSmall>
                </StyledMenuItem>
                <StyledMenuItem>
                  <StyledTitleSmall onClick={onUploadClick}>
                    {t('uploadAudio')}
                    <input
                      key={inputRef.current?.toString()}
                      ref={inputRef}
                      hidden
                      accept={ALLOWED_AUDIO_FILE_TYPES}
                      type="file"
                      onChange={onInputChange}
                    />
                  </StyledTitleSmall>
                </StyledMenuItem>
              </StyledMenuList>
            </Paper>
          </StyledFlexColumn>
        }
        trigger={
          <StyledIconCenter>
            <Svg id="md-editor-audio" />
          </StyledIconCenter>
        }
      />
      {isPopupVisible && (
        <SourceLinkModal
          title={t('audioLink')}
          handleClose={handlePopupClose}
          handleSubmit={handlePopupSubmit}
        />
      )}
    </>
  );
};
