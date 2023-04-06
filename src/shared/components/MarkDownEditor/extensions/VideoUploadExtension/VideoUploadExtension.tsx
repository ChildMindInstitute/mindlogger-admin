import MdEditor, { InsertContentGenerator } from 'md-editor-rt';
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledFlexColumn, StyledTitleSmall } from 'shared/styles/styledComponents';

import { StyledIconCenter, StyledMenuItem, StyledMenuList } from '../Extensions.styles';
import { SourceLinkModal, SourceLinkModalForm } from '../../SourceLinkModal';
import { useUploadMethods } from '../Extensions.hooks';
import { InsertContentExtensionProps } from '../Extensions.types';

const DropdownToolbar = MdEditor.DropdownToolbar;

export const VideoUploadExtension = ({ onInsert }: InsertContentExtensionProps) => {
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
                  <StyledTitleSmall>{t('videoLink')}</StyledTitleSmall>
                </StyledMenuItem>
                <StyledMenuItem>
                  <StyledTitleSmall onClick={onUploadClick}>
                    {t('uploadVideo')}
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
