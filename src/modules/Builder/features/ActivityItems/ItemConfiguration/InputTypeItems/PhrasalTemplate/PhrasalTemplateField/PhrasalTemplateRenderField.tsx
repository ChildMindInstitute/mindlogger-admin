import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';

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
import { getDictionaryText } from 'shared/utils';

import { StyledLineBreak } from './PhrasalTemplateField.styles';
import { PhrasalTemplateFieldProps } from './PhrasalTemplateField.types';
import { DisplayMode, DisplayModeOptions, KEYWORDS } from './PhrasalTemplateField.const';

export function RenderedField({
  name = '',
  responseOptions = [],
  type = KEYWORDS.SENTENCE,
  ...otherProps
}: Omit<PhrasalTemplateFieldProps, 'canRemove' | 'onRemove' | 'setAnchorPopUp'>) {
  const [displayModes, setDisplayModes] = useState<DisplayMode[]>();
  const [responseFromOptions, setResponseFromOptions] = useState<SliderRowsItemResponseValues[]>();
  const { t } = useTranslation('app');
  const params = useParams();

  const { control, setValue: setValueProp } = useCustomFormContext();
  // Save setValue to ref to eliminate problematic dependency on effects, avoiding unnecessary
  // re-renders and visible performance degradation
  const setValueRef = useRef(setValueProp);
  const setValue = setValueRef.current;

  const fieldValue = useWatch({ control, name });
  const itemsFromStore = applet.useActivityItemsFromApplet(params?.activityId || '');
  const responseItem = useMemo(
    () =>
      type === KEYWORDS.ITEM_RESPONSE
        ? responseOptions?.find((item) => fieldValue?.itemName === item.name)
        : undefined,
    [fieldValue?.itemName, responseOptions, type],
  );

  // Update secondary dropdown options based on selected response item type
  useEffect(() => {
    if (type !== KEYWORDS.ITEM_RESPONSE || !responseItem) {
      setResponseFromOptions(undefined);
      setDisplayModes(undefined);

      // Remove itemIndex and displayMode if not a response item type
      if (fieldValue.displayMode !== undefined) setValue(`${name}.displayMode`, undefined);
      if (fieldValue.itemIndex !== undefined) setValue(`${name}.itemIndex`, undefined);

      return;
    }

    // Set up dropdown for item types supporting responseFrom property (SliderRows only)
    if (responseItem.responseType === ItemResponseType.SliderRows) {
      setResponseFromOptions(responseItem.responseValues?.rows);
      setDisplayModes(undefined);

      // Set default value for itemIndex if not set, or out of range
      if (
        typeof fieldValue.itemIndex !== 'number' ||
        fieldValue.itemIndex >= responseItem.responseValues?.rows.length
      ) {
        setValue(`${name}.itemIndex`, 0);
      }
    } else {
      setResponseFromOptions(undefined);
      if (typeof fieldValue.itemIndex === 'number') setValue(`${name}.itemIndex`, null);
    }

    const displayModeOptions = DisplayModeOptions[responseItem.responseType];

    // Set up dropdown for item types supporting displayMode property (undefined if unsupported)
    setDisplayModes(displayModeOptions);
    if (fieldValue.displayMode === undefined) {
      // Set default value for displayMode if not set
      setValue(`${name}.displayMode`, displayModeOptions?.[0] ?? KEYWORDS.DISPLAY_SENTENCE);
    } else if (displayModeOptions && !displayModeOptions.includes(fieldValue.displayMode)) {
      // Reset displayMode to the first option if not supported by the selected response item type
      setValue(`${name}.displayMode`, displayModeOptions[0]);
    }
  }, [
    responseItem,
    fieldValue.itemIndex,
    type,
    responseOptions,
    name,
    setValue,
    fieldValue.displayMode,
  ]);

  useEffect(() => {
    if (fieldValue?.itemName && type === KEYWORDS.ITEM_RESPONSE) {
      // Flag deleted items
      if (!responseItem && !fieldValue.itemName.includes('-deleted')) {
        setValue(`${name}.itemName`, `${fieldValue.itemName}-deleted`);
      }

      // Update indexed item label in form context to be consumed by PreviewPhrasePopup
      if (fieldValue.itemIndex !== undefined && responseFromOptions) {
        setValue(`${name}._indexedItemLabel`, responseFromOptions[fieldValue.itemIndex]?.label, {
          shouldDirty: false,
        });
      }
    }
  }, [
    fieldValue.itemName,
    fieldValue.itemIndex,
    responseItem,
    type,
    responseFromOptions,
    name,
    setValue,
  ]);

  const getRenderedValue = (value: unknown) => {
    if (!value) {
      return (
        <StyledBodyLarge color={variables.palette.outline}>
          {t('phrasalTemplateItem.fieldResponsePlaceholder')}
        </StyledBodyLarge>
      );
    }

    if (!responseItem) {
      return itemsFromStore?.find((item) => fieldValue?.itemName?.includes(item.name))?.name;
    }

    return responseItem.name;
  };

  const getDisplayModeRenderedValue = (value: unknown) => {
    if (!value) {
      return (
        <StyledBodyLarge color={variables.palette.outline}>
          {t('phrasalTemplateItem.fieldResponsePlaceholder')}
        </StyledBodyLarge>
      );
    }

    return t(`phrasalTemplateItem.displayModes.${value}`);
  };

  const getResponseFromRenderedValue = (value: unknown) => {
    if (typeof value !== 'number') {
      return (
        <StyledBodyLarge color={variables.palette.outline}>
          {t('phrasalTemplateItem.fieldResponsePlaceholder')}
        </StyledBodyLarge>
      );
    }

    return responseFromOptions?.[value]?.label;
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
              tooltip: <StyledMdPreview modelValue={getDictionaryText(question)} />,
              tooltipPlacement: 'left',
              value: name ?? '',
            }))}
            SelectProps={{
              displayEmpty: true,
              renderValue: getRenderedValue,
              startAdornment: <Svg aria-hidden id="commentDots" />,
            }}
            TooltipProps={{
              placement: 'left',
              tooltipTitle: responseItem ? (
                <StyledMdPreview modelValue={getDictionaryText(responseItem.question)} />
              ) : null,
            }}
          />
          {displayModes && (
            <SelectController
              name={`${name}.displayMode`}
              control={control}
              defaultValue={displayModes[0]}
              fullWidth
              options={displayModes.map((id) => ({
                labelKey: t(`phrasalTemplateItem.displayModes.${id}`),
                value: id,
              }))}
              SelectProps={{
                displayEmpty: true,
                renderValue: getDisplayModeRenderedValue,
              }}
            />
          )}
          {responseFromOptions && (
            <SelectController
              name={`${name}.itemIndex`}
              control={control}
              defaultValue={0}
              fullWidth
              isLabelNeedTranslation={false}
              options={responseFromOptions.map(({ label }, index) => ({
                labelKey: label as string,
                value: index as unknown as string,
              }))}
              SelectProps={{
                displayEmpty: true,
                renderValue: getResponseFromRenderedValue,
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
