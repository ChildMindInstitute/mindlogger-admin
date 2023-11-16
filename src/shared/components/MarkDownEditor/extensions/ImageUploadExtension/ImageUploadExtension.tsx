import { DropdownToolbar, InsertContentGenerator } from 'md-editor-rt';
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledFlexColumn, StyledTitleSmall } from 'shared/styles/styledComponents';
import { MediaType, VALID_IMAGE_TYPES } from 'shared/consts';
import { joinWihComma } from 'shared/utils/joinWihComma';

import { StyledIconCenter, StyledMenuItem, StyledMenuList } from '../Extensions.styles';
import { SourceLinkModal, SourceLinkModalForm } from '../../SourceLinkModal';
import { useUploadMethods } from '../Extensions.hooks';
import { MediaContentExtensionProps } from '../Extensions.types';

export const ImageUploadExtension = ({
  onInsert,
  setFileSizeExceeded,
  fileSizeExceeded,
  setIncorrectFormat,
  setIsLoading,
}: MediaContentExtensionProps) => {
  const { t } = useTranslation('app');

  const insertHandler = ({ label, address }: SourceLinkModalForm) => {
    const targetValue = label ? `![${label}](${address})` : `![](${address})` || '';
    const generator: InsertContentGenerator = () => ({
      targetValue,
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
    sourceError,
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
    type: MediaType.Image,
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
                  <StyledTitleSmall>{t('addImgLink')} </StyledTitleSmall>
                </StyledMenuItem>
                <StyledMenuItem>
                  <StyledTitleSmall onClick={onUploadClick}>
                    {t('uploadMdImg')}
                    <input
                      key={inputRef.current?.toString()}
                      ref={inputRef}
                      hidden
                      accept={joinWihComma(VALID_IMAGE_TYPES)}
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
            <Svg id="md-editor-image" />
          </StyledIconCenter>
        }
      />
      {isPopupVisible && (
        <SourceLinkModal
          title={t('addImgLink')}
          error={sourceError}
          handleClose={handlePopupClose}
          handleSubmit={handlePopupSubmit}
        />
      )}
    </>
  );
};
