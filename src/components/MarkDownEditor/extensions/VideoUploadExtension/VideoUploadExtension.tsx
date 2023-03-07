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

const VideoUploadExtension: FC<UploadExtensionProps> = ({ onInsert }) => {
  const { t } = useTranslation('app');
  const insertHandler = (values: SourceLinkModalForm) => {
    const generator: InsertContentGenerator = () => ({
      targetValue: `<figure><figcaption>${values.label}:</figcaption><video controls width="250"><source src="${values.address}"></video></figure>`,
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
                  <StyledTitleSmall>{t('mdEditorVideoLink')} </StyledTitleSmall>
                </StyledMenuItem>
                <StyledMenuItem>
                  <StyledTitleSmall onClick={onUploadClick}>
                    {t('mdEditorUploadVideo')}
                    <input
                      ref={inputRef}
                      hidden
                      accept="video/*"
                      type="file"
                      onChange={onInputChange}
                    />
                  </StyledTitleSmall>
                </StyledMenuItem>
              </StyledMenuList>
            </Paper>
          </StyledFlexColumn>
        }
        trigger={<Svg id="md-editor-video" width="16" height="16" />}
      />
      {isPopupVisible && (
        <SourceLinkModal
          title={t('mdEditorVideoLink')}
          handleClose={handlePopupClose}
          handleSubmit={handlePopupSubmit}
        />
      )}
    </>
  );
};

export { VideoUploadExtension };
