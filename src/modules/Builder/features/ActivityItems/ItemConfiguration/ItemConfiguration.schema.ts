import * as yup from 'yup';

import i18n from 'i18n';
import { getMaxLengthValidationError } from 'shared/utils';

import { getNumberRequiredValidationError } from './ItemConfiguration.utils';
import {
  SELECTION_ROW_OPTION_LABEL_MAX_LENGTH,
  SELECTION_OPTION_TEXT_MAX_LENGTH,
  SLIDER_LABEL_MAX_LENGTH,
} from './ItemConfiguration.const';

const { t } = i18n;

export const SelectionOptionScheme = () =>
  yup.object({
    text: yup.string().max(SELECTION_OPTION_TEXT_MAX_LENGTH, getMaxLengthValidationError),
    tooltip: yup.string(),
    score: yup.number().required(getNumberRequiredValidationError()),
  });

export const SelectionRowsItemSchema = () =>
  yup.object({
    label: yup.string().max(SELECTION_ROW_OPTION_LABEL_MAX_LENGTH, getMaxLengthValidationError),
    tooltip: yup.string(),
    image: yup.string(),
    scores: yup.array().of(yup.number().required(getNumberRequiredValidationError())),
  });

export const SelectionRowsOptionSchema = () =>
  yup.object({
    label: yup.string().max(SELECTION_ROW_OPTION_LABEL_MAX_LENGTH, getMaxLengthValidationError),
    tooltip: yup.string(),
    image: yup.string(),
  });

export const SelectionRowsSchema = () =>
  yup.object({
    items: yup.array().of(SelectionRowsItemSchema()),
    options: yup.array().of(SelectionRowsOptionSchema()),
    type: yup.string(),
  });

export const SliderOptionSchema = () =>
  yup.object({
    min: yup.number().required(),
    max: yup.number().required(),
    minLabel: yup.string().max(SLIDER_LABEL_MAX_LENGTH, getMaxLengthValidationError),
    maxLabel: yup.string().max(SLIDER_LABEL_MAX_LENGTH, getMaxLengthValidationError),
    minImage: yup.string(),
    maxImage: yup.string(),
    scores: yup.array().of(yup.mixed().notOneOf([''], getNumberRequiredValidationError())),
  });

export const itemConfigurationFormSchema = () => {
  const itemNameRequired = t('itemNameRequired');
  const itemNameSymbols = t('itemNameSymbols');
  const minValueLessThanMax = t('minValueLessThanMax');
  const minValuePositiveInt = t('minValuePositiveInt');
  const maxValueBiggerThanMin = t('maxValueBiggerThanMin');
  const maxValuePositiveInt = t('maxValuePositiveInt');

  return yup
    .object({
      name: yup
        .string()
        .required(itemNameRequired)
        .matches(/^[a-zA-Z0-9_]+$/, itemNameSymbols),
      minNumber: yup
        .number()
        .typeError(minValuePositiveInt)
        .lessThan(yup.ref('maxNumber'), minValueLessThanMax),
      maxNumber: yup
        .number()
        .typeError(maxValuePositiveInt)
        .moreThan(yup.ref('minNumber'), maxValueBiggerThanMin),
      options: yup.array().of(SelectionOptionScheme()),
      selectionRows: SelectionRowsSchema(),
      sliderOptions: yup.array().of(SliderOptionSchema()),
    })
    .required();
};
