import { v4 as uuidv4 } from 'uuid';
import get from 'lodash.get';

import i18n from 'i18n';
import { ItemResponseType, itemsTypeIcons } from 'shared/consts';
import { createArray, getObjectFromList, getTextBetweenBrackets } from 'shared/utils';
import { ItemFormValues, ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';
import { Config, SliderItemResponseValues, SliderRowsItemResponseValues } from 'shared/state';
import {
  DEFAULT_SLIDER_MAX_VALUE,
  DEFAULT_SLIDER_MIN_NUMBER,
  DEFAULT_NUMBER_SELECT_MIN_VALUE,
  DEFAULT_NUMBER_SELECT_MAX_VALUE,
} from 'modules/Builder/consts';
import { FeatureFlags } from 'shared/types/featureFlags';
import { Chip, ChipShape } from 'shared/components';

import {
  DEFAULT_EMPTY_SLIDER,
  DEFAULT_EMPTY_SLIDER_ROWS,
  DEFAULT_AUDIO_DURATION_SEC,
  SELECTION_OPTIONS_COLOR_PALETTE,
} from './ItemConfiguration.const';
import { getEmptyCondition } from '../../ActivityItemsFlow/ItemFlow/ItemFlow.utils';
import {
  ItemConfigurationSettings,
  GetEmptyAlert,
  ItemsOptionGroup,
} from './ItemConfiguration.types';

const { t } = i18n;

export const getItemsTypeOptions = ({
  featureFlags,
}: {
  featureFlags: FeatureFlags;
}): ItemsOptionGroup[] => [
  {
    groupName: 'select',
    groupOptions: [
      {
        value: ItemResponseType.SingleSelection,
        icon: itemsTypeIcons[ItemResponseType.SingleSelection],
      },
      {
        value: ItemResponseType.MultipleSelection,
        icon: itemsTypeIcons[ItemResponseType.MultipleSelection],
      },
      {
        value: ItemResponseType.Slider,
        icon: itemsTypeIcons[ItemResponseType.Slider],
      },
      {
        value: ItemResponseType.Date,
        icon: itemsTypeIcons[ItemResponseType.Date],
      },
      {
        value: ItemResponseType.NumberSelection,
        icon: itemsTypeIcons[ItemResponseType.NumberSelection],
      },
      {
        value: ItemResponseType.Time,
        icon: itemsTypeIcons[ItemResponseType.Time],
      },
      {
        value: ItemResponseType.TimeRange,
        icon: itemsTypeIcons[ItemResponseType.TimeRange],
      },
    ],
  },
  {
    groupName: 'matrixSelect',
    groupOptions: [
      {
        value: ItemResponseType.SingleSelectionPerRow,
        icon: itemsTypeIcons[ItemResponseType.SingleSelectionPerRow],
      },
      {
        value: ItemResponseType.MultipleSelectionPerRow,
        icon: itemsTypeIcons[ItemResponseType.MultipleSelectionPerRow],
      },
      {
        value: ItemResponseType.SliderRows,
        icon: itemsTypeIcons[ItemResponseType.SliderRows],
      },
    ],
  },
  {
    groupName: 'input',
    groupOptions: [
      { value: ItemResponseType.Text, icon: itemsTypeIcons[ItemResponseType.Text] },
      {
        value: ItemResponseType.ParagraphText,
        icon: itemsTypeIcons[ItemResponseType.ParagraphText],
      },
      {
        value: ItemResponseType.Drawing,
        icon: itemsTypeIcons[ItemResponseType.Drawing],
      },
      {
        value: ItemResponseType.Photo,
        icon: itemsTypeIcons[ItemResponseType.Photo],
      },
      {
        value: ItemResponseType.Video,
        icon: itemsTypeIcons[ItemResponseType.Video],
      },
    ],
  },
  {
    groupName: 'import',
    groupOptions: [
      {
        value: ItemResponseType.RequestHealthRecordData,
        icon: itemsTypeIcons[ItemResponseType.RequestHealthRecordData],
        chip:
          featureFlags.enableEhrHealthData === 'active' ? (
            <Chip
              title={t('active')}
              color="success"
              shape={ChipShape.RectangularLarge}
              canRemove={false}
            />
          ) : undefined,
      },
    ],
  },
  {
    groupName: 'record',
    groupOptions: [
      {
        value: ItemResponseType.Geolocation,
        icon: itemsTypeIcons[ItemResponseType.Geolocation],
      },
      {
        value: ItemResponseType.Audio,
        icon: itemsTypeIcons[ItemResponseType.Audio],
      },
    ],
  },
  {
    groupName: 'display',
    groupOptions: [
      {
        value: ItemResponseType.Message,
        icon: itemsTypeIcons[ItemResponseType.Message],
      },
      {
        value: ItemResponseType.AudioPlayer,
        icon: itemsTypeIcons[ItemResponseType.AudioPlayer],
      },
    ],
  },
  {
    groupName: 'downloadable',
    groupOptions: [
      {
        value: ItemResponseType.PhrasalTemplate,
        icon: itemsTypeIcons[ItemResponseType.PhrasalTemplate],
      },
    ],
  },
];

export const getInputTypeTooltip = (): Record<ItemResponseTypeNoPerfTasks, string> => ({
  [ItemResponseType.SingleSelection]: t('singleSelectionHint'),
  [ItemResponseType.MultipleSelection]: t('multipleSelectionHint'),
  [ItemResponseType.Slider]: t('sliderHint'),
  [ItemResponseType.Date]: t('dateHint'),
  [ItemResponseType.NumberSelection]: t('numberSelectionHint'),
  [ItemResponseType.TimeRange]: t('timeRangeHint'),
  [ItemResponseType.SingleSelectionPerRow]: t('singleSelectionPerRowHint'),
  [ItemResponseType.MultipleSelectionPerRow]: t('multipleSelectionPerRowHint'),
  [ItemResponseType.SliderRows]: t('sliderRowsHint'),
  [ItemResponseType.Text]: t('textHint'),
  [ItemResponseType.ParagraphText]: t('textHint'),
  [ItemResponseType.Drawing]: t('drawingHint'),
  [ItemResponseType.Photo]: t('photoHint'),
  [ItemResponseType.Video]: t('videoHint'),
  [ItemResponseType.Geolocation]: t('geolocationHint'),
  [ItemResponseType.Audio]: t('audioHint'),
  [ItemResponseType.Message]: t('messageHint'),
  [ItemResponseType.RequestHealthRecordData]: t('requestHealthRecordDataHint'),
  [ItemResponseType.AudioPlayer]: t('audioPlayerHint'),
  [ItemResponseType.Time]: t('timeHint'),
  [ItemResponseType.PhrasalTemplate]: t('phrasalTemplateHint'),
});

export const getEmptySliderOption = ({
  isMultiple,
  hasScores,
}: {
  isMultiple?: boolean;
  hasScores?: boolean;
}): SliderItemResponseValues | SliderRowsItemResponseValues => ({
  ...(isMultiple && { id: uuidv4() }),
  ...(isMultiple ? DEFAULT_EMPTY_SLIDER_ROWS : DEFAULT_EMPTY_SLIDER),
  ...(!hasScores && { scores: undefined }),
});

export const getEmptySelectionItemOption = () => ({
  id: uuidv4(),
  text: '',
});

export const getEmptySelectionItemOptions = (length: number) =>
  createArray(length, () => getEmptySelectionItemOption());

export const getEmptySelectionItem = () => ({
  id: uuidv4(),
  rowName: '',
});

export const getPaletteColor = (paletteName: string, index: number) => {
  const colors = SELECTION_OPTIONS_COLOR_PALETTE.find(({ name }) => name === paletteName)?.colors;

  return colors?.[index % colors?.length];
};

export const getEmptyAudioPlayerResponse = () => ({
  file: '',
});

export const getEmptyAudioResponse = () => ({
  maxDuration: DEFAULT_AUDIO_DURATION_SEC,
});

export const getEmptyNumberSelection = () => ({
  minValue: DEFAULT_NUMBER_SELECT_MIN_VALUE,
  maxValue: DEFAULT_NUMBER_SELECT_MAX_VALUE,
});

export const getEmptyFlowItem = () => ({
  match: '',
  itemKey: '',
  conditions: getEmptyCondition(),
});

export const getUnityEmptyFileResponse = () => ({
  file: '',
});

export const getEmptyAlert = ({ config, responseType, responseValues }: GetEmptyAlert) => {
  const isSlider = responseType === ItemResponseType.Slider;
  const alert = {
    key: uuidv4(),
    alert: '',
  };

  if (isSlider && get(config, ItemConfigurationSettings.IsContinuous)) {
    const { minValue, maxValue } = (responseValues as SliderItemResponseValues) ?? {};

    return {
      ...alert,
      minValue: minValue ?? DEFAULT_SLIDER_MIN_NUMBER,
      maxValue: maxValue ?? DEFAULT_SLIDER_MAX_VALUE,
    };
  }

  if (isSlider) {
    const { minValue } = (responseValues as SliderItemResponseValues) ?? {};

    return {
      ...alert,
      value: minValue ?? DEFAULT_SLIDER_MIN_NUMBER,
    };
  }

  if (
    ~[ItemResponseType.SingleSelectionPerRow, ItemResponseType.MultipleSelectionPerRow].indexOf(
      responseType as ItemResponseType,
    )
  ) {
    return {
      ...alert,
      rowId: '',
      optionId: '',
    };
  }

  if (responseType === ItemResponseType.SliderRows) {
    return {
      ...alert,
      sliderId: '',
      value: '',
    };
  }

  return {
    ...alert,
    value: '',
  };
};

export const checkIfQuestionIncludesVariables = (question: string, items: ItemFormValues[]) => {
  const itemsObject = getObjectFromList(items, ({ name }) => name);
  const variableNames = getTextBetweenBrackets(question);

  return variableNames.some((variable) => !!itemsObject[variable]);
};

export const checkIfItemHasRequiredOptions = (config: Config) => {
  const isCorrectAnswerRequired = get(config, ItemConfigurationSettings.IsCorrectAnswerRequired);
  const isNumericalRequired = get(config, ItemConfigurationSettings.IsNumericalRequired);
  const hasResponseDataIdentifier = get(
    config,
    ItemConfigurationSettings.HasResponseDataIdentifier,
  );
  const isResponseRequired = get(config, ItemConfigurationSettings.IsResponseRequired);
  const isTextInputRequired = get(config, ItemConfigurationSettings.IsTextInputRequired);

  return (
    isCorrectAnswerRequired ||
    isNumericalRequired ||
    hasResponseDataIdentifier ||
    isResponseRequired ||
    isTextInputRequired
  );
};
