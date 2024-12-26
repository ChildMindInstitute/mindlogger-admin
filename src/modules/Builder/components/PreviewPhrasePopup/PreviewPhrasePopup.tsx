import { Fragment, useCallback } from 'react';
import { Box } from '@mui/material';
import { FieldArrayWithId } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { PhrasalTemplateField, PhrasalTemplateItemResponseField } from 'redux/modules';
import { Modal, ModalProps } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';

import { StyledImage, StyledPreviewContainer } from './PreviewPhrasePopup.styles';

export const PreviewPhrasePopup = ({
  fields = [],
  name = '',
  imageUrl = '',
  ...otherProps
}: Omit<ModalProps, 'children'> & {
  fields?: FieldArrayWithId<{ values: PhrasalTemplateField[] }, 'values', 'id'>[];
  name?: string;
  imageUrl?: string;
}) => {
  const { t } = useTranslation('app', { keyPrefix: 'phrasalTemplatePreviewPopup' });
  const { getValues } = useCustomFormContext();

  const getPlaceholder = useCallback(
    (fieldValue: PhrasalTemplateItemResponseField) =>
      fieldValue._indexedItemLabel
        ? t('responsePlaceholderWithLabel', {
            itemName: fieldValue.itemName,
            indexedItemLabel: fieldValue._indexedItemLabel.replace(/\s+/, '_'),
          })
        : t('responsePlaceholder', {
            itemName: fieldValue.itemName,
          }),
    [t],
  );

  const renderField = useCallback(
    (_: PhrasalTemplateField, index = 0) => {
      const fieldValue = getValues(`${name}.${index}`);

      if (!fieldValue) {
        return <Fragment key={index} />;
      }

      switch (fieldValue.type) {
        case 'sentence':
          return (
            <Box key={index} component="span">
              {fieldValue.text}
            </Box>
          );
        case 'line_break':
          return <Box key={index} component="hr" sx={{ m: 0, height: 32, border: 'none' }} />;
        case 'item_response':
          return ['sentence', 'sentence_option_row', 'sentence_row_option'].includes(
            fieldValue.displayMode,
          ) ? (
            <Box key={index} component="span" fontWeight="bold">
              {` ${getPlaceholder(fieldValue)} `}
            </Box>
          ) : (
            <ul key={index}>
              <Box component="li" fontWeight="bold">
                {` ${getPlaceholder(fieldValue)} `}
              </Box>
            </ul>
          );
      }
    },
    [getPlaceholder, getValues, name],
  );

  return (
    <Modal submitBtnColor="error" {...otherProps}>
      <StyledModalWrapper>
        <StyledPreviewContainer>
          {imageUrl && <StyledImage aria-hidden src={imageUrl} />}
          <div>{fields.map(renderField)}</div>
        </StyledPreviewContainer>
      </StyledModalWrapper>
    </Modal>
  );
};
