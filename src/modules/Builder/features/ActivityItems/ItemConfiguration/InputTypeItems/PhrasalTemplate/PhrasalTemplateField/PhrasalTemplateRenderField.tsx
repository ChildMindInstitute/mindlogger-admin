import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';
import { Svg } from 'shared/components';
import { applet, SliderRowsItemResponseValues } from 'shared/state/Applet';
import { InputController, SelectController } from 'shared/components/FormComponents';
import {
  StyledBodyLarge,
  StyledFlexTopCenter,
  StyledLabelLarge,
  theme,
  variables,
} from 'shared/styles';
import { ItemResponseType } from 'shared/consts';

import { StyledLineBreak } from './PhrasalTemplateField.styles';
import { PhrasalTemplateFieldProps } from './PhrasalTemplateField.types';
import { DisplayModeOptions, KEYWORDS } from './PhrasalTemplateField.const';

export function RenderedField({
  name = '',
  responseOptions = [],
  type = KEYWORDS.SENTENCE,
  ...otherProps
}: Omit<PhrasalTemplateFieldProps, 'canRemove' | 'onRemove'>) {
  const [displayMode, setDisplayMode] = useState<{
    id: string;
    items?: Array<{ id: string; name: string }>;
  }>();
  const [responseFrom, setResponseFrom] = useState<{
    name: string;
    items?: SliderRowsItemResponseValues[];
  }>();
  const { t } = useTranslation('app');
  const params = useParams();
  const { control, getValues, setValue } = useCustomFormContext();
  const fieldValue = getValues(name as string);
  const itemsFromStore = applet.useActivityItemsFromApplet(params?.activityId || '');
  const { question: selectedOptionQuestion } =
    responseOptions?.find(({ name }) => fieldValue?.itemName === name) ?? {};

  const isFieldValueDeleted = fieldValue?.itemName?.includes('-deleted');

  useEffect(() => {
    if (
      fieldValue?.itemName &&
      type === KEYWORDS.ITEM_RESPONSE &&
      !selectedOptionQuestion &&
      !isFieldValueDeleted
    ) {
      setValue(name, {
        displayMode: KEYWORDS.SENTENCE,
        itemName: `${fieldValue.itemName}-deleted`,
        type: KEYWORDS.ITEM_RESPONSE,
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
      const missedItem = itemsFromStore?.find((item) => {
        if (fieldValue?.itemName?.includes(item?.name)) {
          return item;
        }

        return null;
      });

      return missedItem?.name;
    }

    if (
      selectedItem?.responseType !== displayMode?.id &&
      selectedItem?.responseType !== ItemResponseType.SliderRows
    ) {
      const items = DisplayModeOptions[selectedItem?.responseType || 'default'];

      setDisplayMode({
        id: selectedItem?.responseType as string,
        items,
      });
      setResponseFrom(undefined);
      setValue(name, {
        ...fieldValue,
        itemIndex: 0,
        displayMode: items ? fieldValue?.displayMode : KEYWORDS.SENTENCE,
      });
    }

    if (
      selectedItem?.name !== responseFrom?.name &&
      selectedItem?.responseType === ItemResponseType.SliderRows
    ) {
      setResponseFrom({
        name: selectedItem?.name,
        items: selectedItem?.responseValues?.rows,
      });
      setDisplayMode(undefined);
      setValue(name, {
        ...fieldValue,
        displayMode: KEYWORDS.SENTENCE,
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

  const getResponseFromRenderedValue = (value: unknown) => {
    if (!value && typeof Number(value) !== 'number') {
      return (
        <StyledBodyLarge color={variables.palette.outline}>
          {t('phrasalTemplateItem.fieldResponsePlaceholder')}
        </StyledBodyLarge>
      );
    }

    const selectedFromResponse = responseFrom?.items?.[Number(value)];

    return selectedFromResponse?.label;
  };

  switch (type) {
    case KEYWORDS.ITEM_RESPONSE:
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
          {responseFrom?.items && (
            <SelectController
              name={`${name}.itemIndex`}
              control={control}
              defaultValue=""
              fullWidth
              options={responseFrom?.items.map(({ label }, index) => ({
                labelKey: label as string,
                tooltip: <StyledMdPreview modelValue={(name as unknown as string) ?? ''} />,
                value: `${index}`,
              }))}
              SelectProps={{
                displayEmpty: true,
                renderValue: getResponseFromRenderedValue,
                startAdornment: <Svg aria-hidden id="commentDots" />,
              }}
            />
          )}
        </>
      );
    case KEYWORDS.LINE_BREAK:
      return (
        <StyledFlexTopCenter sx={{ height: theme.spacing(5.6), width: '100%' }}>
          <StyledLabelLarge color={variables.palette.outline} sx={{ flexShrink: 0 }}>
            {t('phrasalTemplateItem.fieldLineBreakTitle')}
          </StyledLabelLarge>

          <StyledLineBreak />
        </StyledFlexTopCenter>
      );
    case KEYWORDS.SENTENCE:
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
