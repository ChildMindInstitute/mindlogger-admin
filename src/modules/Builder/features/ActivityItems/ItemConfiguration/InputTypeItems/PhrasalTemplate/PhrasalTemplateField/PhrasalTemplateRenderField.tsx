import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

export function RenderedField({
  name = '',
  responseOptions = [],
  type = 'sentence',
  ...otherProps
}: Omit<PhrasalTemplateFieldProps, 'canRemove' | 'onRemove'>) {
  const { t } = useTranslation('app');
  const params = useParams();
  const { control, getValues, setValue } = useCustomFormContext();
  const fieldValue = getValues(name as string);
  const activitiesFromStore = applet.useActivityDataFromApplet(params?.activityId || '');
  const { question: selectedOptionQuestion } =
    responseOptions?.find(({ id }) => fieldValue.id === id) ?? {};

  const isFieldValueDeleted = fieldValue?.id?.includes('-deleted');

  if (
    fieldValue?.id &&
    type === 'itemResponse' &&
    !selectedOptionQuestion &&
    !isFieldValueDeleted
  ) {
    setValue(name, {
      displayMode: '',
      id: `${fieldValue.id}-deleted`,
      type: 'itemResponse',
      name: responseOptions?.filter(({ id }) => id === fieldValue.id)?.[0]?.name,
    });
  }

  const getRenderedValue = (value: unknown) => {
    if (!value) {
      return (
        <StyledBodyLarge color={variables.palette.outline}>
          {t('phrasalTemplateItem.fieldResponsePlaceholder')}
        </StyledBodyLarge>
      );
    }

    const selectedItem = responseOptions.find(({ id }) => id === value);

    if (!selectedItem) {
      const missedItem = activitiesFromStore?.find((activity) => {
        if (fieldValue?.id?.includes(activity?.id)) {
          return activity;
        }

        return null;
      });

      return missedItem?.name;
    }

    return selectedItem?.name;
  };

  switch (type) {
    case 'itemResponse':
      return (
        <SelectController
          name={`${name}.id`}
          control={control}
          defaultValue=""
          fullWidth
          options={responseOptions.map(({ id, name, question }) => ({
            labelKey: name,
            tooltip: <StyledMdPreview modelValue={(question as unknown as string) ?? ''} />,
            value: id ?? '',
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
      );
    case 'lineBreak':
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
