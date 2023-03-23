import * as yup from 'yup';

import i18n from 'i18n';

export const SELECTION_ROW_OPTION_LABEL_MAX_LENGTH = 11;
export const SELECTION_ROW_ITEM_LABEL_MAX_LENGTH = 11;

export const SelectionRowsItemScheme = () => {
  const { t } = i18n;

  const numberValueIsRequired = t('numberValueIsRequired');

  const maxLengthLabel = ({ max }: { max: number }) =>
    t('visibilityDecreasesOverMaxCharacters', { max });

  return yup.object({
    label: yup.string().max(SELECTION_ROW_ITEM_LABEL_MAX_LENGTH, maxLengthLabel),
    tooltip: yup.string(),
    image: yup.string(),
    scores: yup.array().of(yup.number().required(numberValueIsRequired)),
  });
};

export const SelectionRowsOptionScheme = () => {
  const { t } = i18n;

  const maxLengthLabel = ({ max }: { max: number }) =>
    t('visibilityDecreasesOverMaxCharacters', { max });

  return yup.object({
    label: yup.string().max(SELECTION_ROW_OPTION_LABEL_MAX_LENGTH, maxLengthLabel),
    tooltip: yup.string(),
    image: yup.string(),
  });
};

export const SelectionRowsScheme = () =>
  yup.object({
    items: yup.array().of(SelectionRowsItemScheme()),
    options: yup.array().of(SelectionRowsOptionScheme()),
    type: yup.string(),
  });

export const ItemConfigurationScheme = () =>
  yup.object({
    selectionRows: SelectionRowsScheme(),
  });
