/* eslint-disable import/order */
import { Box, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useState, useEffect } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';

import { useCustomFormContext } from 'modules/Builder/hooks';
import {
  PhrasalTemplateField as TPhrasalTemplateField,
  PhrasalTemplateFieldType,
} from 'redux/modules';
import { Menu, Svg, Tooltip } from 'shared/components';
import {
  StyledFlexSpaceBetween,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  variables,
} from 'shared/styles';
import { DndDroppable } from 'modules/Builder/components';
import { RemovePhrasePopup } from 'modules/Builder/components/RemovePhrasePopup';
import { PreviewPhrasePopup } from 'modules/Builder/components/PreviewPhrasePopup/PreviewPhrasePopup';

import { PhrasalTemplateField } from '../PhrasalTemplateField';
import { PhrasalTemplateImageField } from '../PhrasalTemplateImageField';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledPhraseTemplateFieldSet,
} from './PhrasalTemplatePhrase.styles';
import { PhrasalTemplatePhraseProps } from './PhrasalTemplatePhrase.types';
import { getFieldPlaceholders, getNewDefaultField } from '../PhrasalTemplate.utils';
import { KEYWORDS } from '../PhrasalTemplateField/PhrasalTemplateField.const';
import { validatePhraseField } from './PhrasalTemplatePhrase.utils';

export const PhrasalTemplatePhrase = ({
  name = '',
  responseOptions = [],
  index = 0,
  onRemovePhrase,
}: PhrasalTemplatePhraseProps) => {
  const { t } = useTranslation('app');
  const [removePopupOpen, setRemovePopupOpen] = useState(false);
  const [previewPopupOpen, setPreviewPopupOpen] = useState(false);
  const [previewPhraseDisabled, setPreviewPhraseDisabled] = useState(false);

  const [addItemMenuAnchorEl, setAddItemMenuAnchorEl] = useState<null | HTMLElement>(null);
  const phraseFieldsName = `${name}.fields`;
  const { control, setValue, getValues, formState } = useCustomFormContext();
  const { fields, append, remove, swap } = useFieldArray({
    control: control as unknown as Control<{ values: TPhrasalTemplateField[] }>,
    name: phraseFieldsName as 'values',
  });

  // Trigger validation when `fields` or form state changes to update preview button state
  useEffect(() => {
    const validateField = async () => {
      const isValid = await validatePhraseField(getValues(name));
      setPreviewPhraseDisabled(!isValid);
    };

    validateField();
  }, [name, getValues, formState]);

  const imageFieldValue = getValues(`${name}.image`) || '';
  const fieldPlaceholders = getFieldPlaceholders(fields);

  const handleOpenAddItemMenu = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    setAddItemMenuAnchorEl(evt.currentTarget);
  }, []);

  const handleCloseAddItemMenu = useCallback(() => {
    setAddItemMenuAnchorEl(null);
  }, []);

  const handleAddField = useCallback(
    (type: PhrasalTemplateFieldType) => {
      append(getNewDefaultField(type));
    },
    [append],
  );

  const handleRemoveField = useCallback(
    (fieldIndex: number) => () => {
      remove(fieldIndex);
    },
    [remove],
  );

  const handleShowRemovePopup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    setRemovePopupOpen(true);
  };

  const handleRemovePhrase = () => {
    setRemovePopupOpen(false);
    onRemovePhrase?.();
  };

  const handlePreviewPhrase = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    setPreviewPopupOpen(true);
  };

  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({ destination, source }) => {
    if (
      !destination ||
      source?.index === destination?.index ||
      typeof source?.index !== 'number' ||
      typeof destination?.index !== 'number'
    )
      return;

    swap(source.index, destination.index);
  };

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary>
        <StyledFlexSpaceBetween sx={{ width: '100%' }}>
          <StyledFlexTopCenter sx={{ gap: 0.8 }}>
            <IconButton data-toggle>
              <Svg aria-label={t('phrasalTemplateItem.btnToggleFields')} id="navigate-down" />
            </IconButton>

            <StyledLabelBoldLarge>
              {t('phrasalTemplateItem.phraseOrder', { order: index + 1 })}
            </StyledLabelBoldLarge>

            <Tooltip tooltipTitle={t('phrasalTemplateItem.titleHint')}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                }}
                type="button"
              >
                <Svg
                  aria-label={t('phrasalTemplateItem.titleHintLabel')}
                  fill={variables.palette.outline}
                  height={18}
                  id="help"
                  width={18}
                />
              </IconButton>
            </Tooltip>
          </StyledFlexTopCenter>

          <StyledFlexTopCenter
            onClick={(e) => {
              // This exists in order to prevent clicks on the child Button
              // from propagating up and triggering the Accordion
              // expand / collapse behavior when it is `disabled`.
              e.stopPropagation();
            }}
            sx={{ gap: 0.8 }}
          >
            <Button
              onClick={handlePreviewPhrase}
              sx={{ gap: 0.8, width: 'max-content' }}
              variant="text"
              disabled={previewPhraseDisabled}
            >
              <Svg aria-hidden height={18} id="notes" width={18} />
              {t('phrasalTemplateItem.btnPreviewPhrase')}
            </Button>

            <IconButton color="default" onClick={handleShowRemovePopup}>
              <Svg
                aria-label={t('phrasalTemplateItem.btnRemovePhrase')}
                fill="currentColor"
                id="trash"
              />
            </IconButton>
          </StyledFlexTopCenter>
        </StyledFlexSpaceBetween>
      </StyledAccordionSummary>

      <StyledAccordionDetails>
        <PhrasalTemplateImageField
          value={imageFieldValue}
          onChangeValue={(value = '') => setValue(`${name}.image`, value || '')}
        />

        <DragDropContext onDragEnd={handleDragEnd}>
          <DndDroppable droppableId="phrasal-dnd-template" direction="vertical">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                <StyledPhraseTemplateFieldSet>
                  {fields.map((field, fieldIndex) => {
                    const isOnlySentenceField =
                      field.type === KEYWORDS.SENTENCE &&
                      fields.filter(({ type }) => type === KEYWORDS.SENTENCE).length < 2;
                    const isOnlyResponseField =
                      field.type === KEYWORDS.ITEM_RESPONSE &&
                      fields.filter(({ type }) => type === KEYWORDS.ITEM_RESPONSE).length < 2;
                    const hasMinimumFields = fields.length > 2;

                    return (
                      <>
                        <PhrasalTemplateField
                          key={`draggable-item-${field.id}`}
                          itemId={`draggable-item-${field.id}`}
                          index={fieldIndex}
                          canRemove={
                            hasMinimumFields && !isOnlyResponseField && !isOnlySentenceField
                          }
                          name={`${phraseFieldsName}.${fieldIndex}`}
                          onRemove={handleRemoveField(fieldIndex)}
                          responseOptions={responseOptions}
                          type={field.type}
                          placeholder={fieldPlaceholders[fieldIndex]}
                        />
                      </>
                    );
                  })}
                </StyledPhraseTemplateFieldSet>
              </Box>
            )}
          </DndDroppable>
        </DragDropContext>
        <Button
          aria-expanded={Boolean(addItemMenuAnchorEl)}
          aria-haspopup="true"
          onClick={handleOpenAddItemMenu}
          sx={{ gap: 0.8, ml: -1.4, width: 'max-content' }}
          variant="text"
        >
          <Svg aria-hidden height={18} id="add" width={18} />

          {t('phrasalTemplateItem.btnAddField')}
        </Button>

        <Menu
          anchorEl={addItemMenuAnchorEl}
          onClose={handleCloseAddItemMenu}
          menuItems={[
            {
              action: () => {
                handleAddField(KEYWORDS.SENTENCE);
              },
              icon: <Svg id="formatText" />,
              title: 'phrasalTemplateItem.fieldSentenceTitle',
            },
            {
              action: () => {
                handleAddField(KEYWORDS.ITEM_RESPONSE);
              },
              icon: <Svg id="commentDots" />,
              title: 'phrasalTemplateItem.fieldResponseTitle',
            },
            {
              action: () => {
                handleAddField(KEYWORDS.LINE_BREAK);
              },
              icon: <Svg id="flow-outlined" />,
              title: 'phrasalTemplateItem.fieldLineBreakTitle',
            },
          ]}
        />
      </StyledAccordionDetails>

      <RemovePhrasePopup
        open={removePopupOpen}
        onClose={() => setRemovePopupOpen(false)}
        onRemove={handleRemovePhrase}
      />

      <PreviewPhrasePopup
        title={t('phrasalTemplatePreviewPopup.title', { index: index + 1 })}
        fields={fields}
        name={phraseFieldsName}
        imageUrl={imageFieldValue}
        open={previewPopupOpen}
        onClose={() => setPreviewPopupOpen(false)}
      />
    </StyledAccordion>
  );
};
