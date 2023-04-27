import MdEditor, { InsertContentGenerator } from 'md-editor-rt';
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledFlexColumn, StyledTitleSmall } from 'shared/styles/styledComponents';

import { StyledIconCenter, StyledMenuItem, StyledMenuList } from '../Extensions.styles';
import { SourceLinkModal } from '../../SourceLinkModal';
import { useUploadMethods } from '../Extensions.hooks';
import { InsertContentExtensionProps, InsertHandlerProps } from '../Extensions.types';

const DropdownToolbar = MdEditor.DropdownToolbar;

export const ImageUploadExtension = ({ onInsert }: InsertContentExtensionProps) => {
  const { t } = useTranslation('app');

  const insertHandler = ({ values, imgLink }: InsertHandlerProps) => {
    const targetValue = values ? `![${values.label}](${values.address})` : `![](${imgLink})` || '';
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
    handlePopupSubmit,
    handlePopupClose,
    onAddLinkClick,
    onUploadClick,
    onInputChange,
    inputRef,
  } = useUploadMethods({
    insertHandler,
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
                      ref={inputRef}
                      hidden
                      accept="image/*"
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
          handleClose={handlePopupClose}
          handleSubmit={handlePopupSubmit}
        />
      )}
    </>
  );
};
