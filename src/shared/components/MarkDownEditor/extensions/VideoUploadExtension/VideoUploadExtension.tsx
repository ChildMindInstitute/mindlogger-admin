import MdEditor, { InsertContentGenerator } from 'md-editor-rt';
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledFlexColumn, StyledTitleSmall } from 'shared/styles/styledComponents';
import { ALLOWED_VIDEO_FILE_TYPES, MediaType } from 'shared/consts';

import { StyledIconCenter, StyledMenuItem, StyledMenuList } from '../Extensions.styles';
import { SourceLinkModal, SourceLinkModalForm } from '../../SourceLinkModal';
import { useUploadMethods } from '../Extensions.hooks';
import { MediaContentExtensionProps } from '../Extensions.types';

const DropdownToolbar = MdEditor.DropdownToolbar;

export const VideoUploadExtension = ({
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
    type: MediaType.Video,
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
                  <StyledTitleSmall>{t('videoLink')}</StyledTitleSmall>
                </StyledMenuItem>
                <StyledMenuItem>
                  <StyledTitleSmall onClick={onUploadClick}>
                    {t('uploadVideo')}
                    <input
                      key={inputRef.current?.toString()}
                      ref={inputRef}
                      hidden
                      accept={ALLOWED_VIDEO_FILE_TYPES}
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
            <Svg id="md-editor-video" />
          </StyledIconCenter>
        }
      />
      {isPopupVisible && (
        <SourceLinkModal
          title={t('videoLink')}
          handleClose={handlePopupClose}
          handleSubmit={handlePopupSubmit}
        />
      )}
    </>
  );
};
