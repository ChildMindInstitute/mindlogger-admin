import React, { FC } from 'react';
import MdEditor, { InsertContentGenerator } from 'md-editor-rt';
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { StyledFlexColumn, StyledTitleSmall } from 'styles/styledComponents';

import { StyledMenuItem, StyledMenuList } from '../extensions.styles';
import { SourceLinkModal, SourceLinkModalForm } from '../../SourceLinkModal';
import { useUploadMethods } from '../extensions.hooks';
import { UploadExtensionProps } from '../extensions.types';

const DropdownToolbar = MdEditor.DropdownToolbar;

const ImageUploadExtension: FC<UploadExtensionProps> = ({ onInsert }) => {
  const { t } = useTranslation('app');
  const insertHandler = (values: SourceLinkModalForm) => {
    const generator: InsertContentGenerator = () => ({
      targetValue: `![${values.label}](${values.address})`,
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
                  <StyledTitleSmall>{t('mdEditorAddImgLink')} </StyledTitleSmall>
                </StyledMenuItem>
                <StyledMenuItem>
                  <StyledTitleSmall onClick={onUploadClick}>
                    {t('mdEditorUploadImg')}
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
        trigger={<Svg id="md-editor-image" width="16" height="16" />}
      />
      {isPopupVisible && (
        <SourceLinkModal
          title={t('mdEditorAddImgLink')}
          handleClose={handlePopupClose}
          handleSubmit={handlePopupSubmit}
        />
      )}
    </>
  );
};

export { ImageUploadExtension };
