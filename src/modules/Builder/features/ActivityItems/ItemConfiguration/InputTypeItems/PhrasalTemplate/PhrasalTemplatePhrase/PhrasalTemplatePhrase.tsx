import { Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';

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

export const PhrasalTemplatePhrase = ({
  canRemovePhrase = false,
  name = '',
  responseOptions = [],
  index = 0,
  onRemovePhrase,
}: PhrasalTemplatePhraseProps) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const phraseFieldsName = `${name}.fields`;
  const { control, setValue, getValues } = useCustomFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control as unknown as Control<{ values: TPhrasalTemplateField[] }>,
    name: phraseFieldsName as 'values',
    rules: { minLength: 2 },
  });
  const imageFieldValue = getValues(`${name}.image`) || '';
  const fieldPlaceholders = getFieldPlaceholders(fields);

  const handleAddField = (type: PhrasalTemplateFieldType = 'sentence') => {
    append(getNewDefaultField(type));
  };

  const handlePressAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRemovePhrase = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    onRemovePhrase?.();
    console.warn('TODO: M2-7163 — Remove Phrase');
  };

  const handlePreviewPhrase = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    console.warn('TODO: M2-7164 — Preview Phrase');
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

          <StyledFlexTopCenter sx={{ gap: 0.8 }}>
            <Button
              onClick={handlePreviewPhrase}
              sx={{ gap: 0.8, width: 'max-content' }}
              variant="text"
            >
              <Svg aria-hidden height={18} id="notes" width={18} />
              {t('phrasalTemplateItem.btnPreviewPhrase')}
            </Button>

            <IconButton color="default" disabled={!canRemovePhrase} onClick={handleRemovePhrase}>
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

        <StyledPhraseTemplateFieldSet>
          {fields.map((field, i) => {
            const isOnlySentenceField =
              field.type === 'sentence' &&
              fields.filter(({ type }) => type === 'sentence').length < 2;
            const isOnlyResponseField =
              field.type === 'itemResponse' &&
              fields.filter(({ type }) => type === 'itemResponse').length < 2;
            const hasMinimumFields = fields.length > 2;

            return (
              <PhrasalTemplateField
                canRemove={hasMinimumFields && !isOnlyResponseField && !isOnlySentenceField}
                key={field.id}
                name={`${phraseFieldsName}.${i}`}
                onRemove={() => {
                  remove(i);
                }}
                responseOptions={responseOptions}
                type={field.type}
                placeholder={fieldPlaceholders[i]}
              />
            );
          })}
        </StyledPhraseTemplateFieldSet>

        <Button
          aria-expanded={open}
          aria-haspopup="true"
          onClick={handlePressAdd}
          sx={{ gap: 0.8, width: 'max-content' }}
          variant="text"
        >
          <Svg aria-hidden height={18} id="add" width={18} />

          {t('phrasalTemplateItem.btnAddField')}
        </Button>

        <Menu
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
          menuItems={[
            {
              action: () => {
                handleAddField('sentence');
                console.warn('TODO: M2-7183 Add Phrasal Fields');
              },
              icon: <Svg id="formatText" />,
              title: 'phrasalTemplateItem.fieldSentenceTitle',
            },
            {
              action: () => {
                handleAddField('itemResponse');
                console.warn('TODO: M2-7183 Add Phrasal Fields');
              },
              icon: <Svg id="commentDots" />,
              title: 'phrasalTemplateItem.fieldResponseTitle',
            },
            {
              action: () => {
                handleAddField('lineBreak');
                console.warn('TODO: M2-7183 Add Phrasal Fields');
              },
              icon: <Svg id="flow-outlined" />,
              title: 'phrasalTemplateItem.fieldLineBreakTitle',
            },
          ]}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
