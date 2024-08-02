import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';
import { Svg } from 'shared/components';
import { applet } from 'shared/state/Applet';
import { InputController, SelectController } from 'shared/components/FormComponents';
import {
  StyledBodyLarge,
  StyledFlexTopCenter,
  StyledLabelLarge,
  theme,
  variables,
} from 'shared/styles';

import { StyledLineBreak } from './PhrasalTemplateField.styles';
import { PhrasalTemplateFieldProps } from './PhrasalTemplateField.types';
import { DisplayModeOptions } from './constants';

export function RenderedField({
  name = '',
  responseOptions = [],
  type = 'sentence',
  ...otherProps
}: Omit<PhrasalTemplateFieldProps, 'canRemove' | 'onRemove'>) {
  const [displayMode, setDisplayMode] = useState<{
    id: string;
    items?: Array<{ id: string; name: string }>;
  }>();
  const { t } = useTranslation('app');
  const params = useParams();
  const { control, getValues, setValue } = useCustomFormContext();
  const fieldValue = getValues(name as string);
  const activitiesFromStore = applet.useActivityDataFromApplet(params?.activityId || '');
  const { question: selectedOptionQuestion } =
    responseOptions?.find(({ name }) => fieldValue.itemName === name) ?? {};

  const isFieldValueDeleted = fieldValue?.itemName?.includes('-deleted');

  useEffect(() => {
    if (
      fieldValue?.itemName &&
      type === 'item_response' &&
      !selectedOptionQuestion &&
      !isFieldValueDeleted
    ) {
      setValue(name, {
        displayMode: '',
        itemName: `${fieldValue.itemName}-deleted`,
        type: 'item_response',
        itemIndex: 0,
      });
    }
  }, [isFieldValueDeleted, fieldValue, name, setValue, selectedOptionQuestion, type]);

  const getRenderedValue = (value: unknown) => {
    if (!value) {
      return (
        <StyledBodyLarge color={variables.palette.outline}>
          {t('phrasalTemplateItem.fieldResponsePlaceholder')}
        </StyledBodyLarge>
      );
    }

    const selectedItem = responseOptions.find(({ name }) => name === value);

    if (!selectedItem) {
      const missedItem = activitiesFromStore?.find((activity) => {
        if (fieldValue?.id?.includes(activity?.id)) {
          return activity;
        }

        return null;
      });

      return missedItem?.name;
    }

    if (selectedItem?.responseType !== displayMode?.id) {
      setDisplayMode({
        id: selectedItem?.responseType as string,
        items: DisplayModeOptions[selectedItem?.responseType || 'default'],
      });
    }

    return selectedItem?.name;
  };

  const getDisplayModeRenderedValue = (value: unknown) => {
    if (!value) {
      return (
        <StyledBodyLarge color={variables.palette.outline}>
          {t('phrasalTemplateItem.fieldResponsePlaceholder')}
        </StyledBodyLarge>
      );
    }

    const selectedDisplayMode = displayMode?.items?.find(({ id }) => id === value);

    return selectedDisplayMode?.name;
  };

  switch (type) {
    case 'item_response':
      return (
        <>
          <SelectController
            name={`${name}.itemName`}
            control={control}
            defaultValue=""
            fullWidth
            options={responseOptions.map(({ name, question }) => ({
              labelKey: name,
              tooltip: <StyledMdPreview modelValue={(question as unknown as string) ?? ''} />,
              value: name ?? '',
            }))}
            SelectProps={{
              displayEmpty: true,
              renderValue: getRenderedValue,
              startAdornment: <Svg aria-hidden id="commentDots" />,
            }}
            TooltipProps={{
              placement: 'left',
              tooltipTitle: selectedOptionQuestion ? (
                <StyledMdPreview modelValue={(selectedOptionQuestion as unknown as string) ?? ''} />
              ) : null,
            }}
          />
          {displayMode?.items && (
            <SelectController
              name={`${name}.displayMode`}
              control={control}
              defaultValue=""
              fullWidth
              options={displayMode?.items.map(({ name, id }) => ({
                labelKey: name,
                tooltip: <StyledMdPreview modelValue={(name as unknown as string) ?? ''} />,
                value: id ?? '',
              }))}
              SelectProps={{
                displayEmpty: true,
                renderValue: getDisplayModeRenderedValue,
                startAdornment: <Svg aria-hidden id="commentDots" />,
              }}
            />
          )}
        </>
      );
    case 'line_break':
      return (
        <StyledFlexTopCenter sx={{ height: theme.spacing(5.6), width: '100%' }}>
          <StyledLabelLarge color={variables.palette.outline} sx={{ flexShrink: 0 }}>
            {t('phrasalTemplateItem.fieldLineBreakTitle')}
          </StyledLabelLarge>

          <StyledLineBreak />
        </StyledFlexTopCenter>
      );
    case 'sentence':
    default:
      return (
        <InputController
          control={control}
          InputProps={{ startAdornment: <Svg aria-hidden id="formatText" /> }}
          name={`${name}.text`}
          placeholder={otherProps.placeholder ?? t('phrasalTemplateItem.fieldSentencePlaceholder')}
          sx={{ ...otherProps.sx, width: '100%' }}
          withDebounce
        />
      );
  }
}
