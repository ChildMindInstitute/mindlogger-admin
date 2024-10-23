import { useCallback } from 'react';
import { Box } from '@mui/material';
import { FieldArrayWithId } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { PhrasalTemplateField } from 'redux/modules';
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
  const { t } = useTranslation('app');
  const { getValues } = useCustomFormContext();

  const renderField = useCallback(
    (_: PhrasalTemplateField, index = 0) => {
      const fieldValue = getValues(`${name}.${index}` as string);

      if (!fieldValue) {
        return '';
      }

      const renderedName = ` ${t('phrasalTemplatePreviewPopup.responsePlaceholder', {
        itemName: fieldValue?.itemName,
      })} `;

      switch (fieldValue.type) {
        case 'sentence':
          return <Box component="span">{fieldValue.text}</Box>;
        case 'line_break':
          return <Box component="hr" sx={{ m: 0, height: 32, border: 'none' }} />;
        case 'item_response':
          return ['sentence', 'sentence_option_row', 'sentence_row_option'].includes(
            fieldValue.displayMode,
          ) ? (
            <Box component="span" fontWeight="bold">
              {renderedName}
            </Box>
          ) : (
            <ul>
              <Box component="li" fontWeight="bold">
                {renderedName}
              </Box>
            </ul>
          );
      }
    },
    [getValues, name, t],
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
