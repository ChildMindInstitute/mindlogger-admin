import { useFieldArray } from 'react-hook-form';
import { Box, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledTitleMedium,
  variables,
} from 'shared/styles';
import { Svg, Tooltip } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { Item } from 'redux/modules';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { PhrasalTemplatePhrase } from './PhrasalTemplatePhrase';
import { StyledPhrasalTemplateList } from './PhrasalTemplate.styles';
import { getActivityItemsForResponseField, getNewDefaultPhrase } from './PhrasalTemplate.utils';

export const PhrasalTemplate = ({ name = '' }: { name?: string }) => {
  const [activitiesIndexString, itemIndexString] = name.split('.items.');
  const { t } = useTranslation('app');
  const phraseName = `${name}.responseValues.phrases`;
  const { control, getValues } = useCustomFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: phraseName,
    rules: { minLength: 1 },
  });
  const { items = [] }: { items?: Item[] } = getValues(activitiesIndexString) ?? {};
  const currentItemIndex = parseInt(itemIndexString, 10);
  const responseOptions = useMemo(
    () => getActivityItemsForResponseField(items, currentItemIndex),
    [currentItemIndex, items],
  );

  const handleAddPhrase = () => {
    append(getNewDefaultPhrase());
  };

  return (
    <StyledFlexColumn sx={{ gap: 2.4, placeContent: 'flex-start' }}>
      <StyledTitleMedium>{t('phrasalTemplateItem.lede')}</StyledTitleMedium>

      <ItemOptionContainer title="">
        <Box
          component="label"
          htmlFor="card-title"
          sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, pb: 2.6 }}
        >
          <StyledFlexTopCenter component={StyledLabelBoldLarge} sx={{ gap: 0.4 }}>
            {t('phrasalTemplateItem.titleLabel')}

            <Tooltip tooltipTitle={t('phrasalTemplateItem.titleHint')}>
              <IconButton type="button">
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

          <InputController
            control={control}
            id="card-title"
            maxLength={75}
            name={`${name}.responseValues.title`}
            placeholder={t('phrasalTemplateItem.titlePlaceholder')}
            withDebounce
          />
        </Box>

        <StyledPhrasalTemplateList>
          {fields.map((field, i) => (
            <PhrasalTemplatePhrase
              canRemovePhrase={fields.length > 1}
              index={i}
              key={field.id}
              name={`${name}.responseValues.phrases.${i}`}
              onRemovePhrase={() => {
                remove(i);
              }}
              responseOptions={responseOptions}
            />
          ))}
        </StyledPhrasalTemplateList>
      </ItemOptionContainer>

      {/* TODO: M2-7162 Will handle adding additional phrases */}
      <Button onClick={handleAddPhrase} sx={{ gap: 0.8, width: 'max-content' }} variant="outlined">
        <Svg id="add" height={18} width={18} />
        {t('phrasalTemplateItem.btnAddPhrase')}
      </Button>
    </StyledFlexColumn>
  );
};