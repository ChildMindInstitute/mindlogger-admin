import { ItemResponseType } from 'shared/consts';
import {
  MultiSelectItemAnswer,
  SingleSelectItemAnswer,
  SliderItemAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export const sliderMocked: SliderItemAnswer = {
  activityItem: {
    id: 'slider-1',
    name: 'slider-1',
    question: { en: '<p>Do you like how the respondent passed the review?<p>' },
    responseType: ItemResponseType.Slider,
    allowEdit: true,
    config: {
      continuousSlider: false,
      removeBackButton: false,
      skippableItem: false,
      addScores: false,
      setAlerts: false,
      showTickMarks: false,
      showTickLabels: false,
      timer: 0,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
    },
    responseValues: {
      minImage: 'https://cdn.pixabay.com/photo/2023/01/10/07/12/cat-7709087__480.jpg',
      minLabel: 'This is a good result',
      minValue: 1,
      maxImage:
        'https://t4.ftcdn.net/jpg/00/84/66/63/360_F_84666330_LoeYCZ5LCobNwWePKbykqEfdQOZ6fipq.jpg',
      maxLabel: 'This is not such a good result as I think',
      maxValue: 9,
    },
  },
  answer: {
    text: '',
    value: 3,
  },
};

export const singleSelectionMocked: SingleSelectItemAnswer = {
  activityItem: {
    id: 'single-select-1',
    name: 'single-select-1',
    question: { en: '<p>Do you like how the respondent passed the review?<p>' },
    allowEdit: true,
    config: {
      removeBackButton: true,
      skippableItem: true,
      randomizeOptions: false,
      addScores: false,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      timer: 0,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
      autoAdvance: false,
    },
    responseType: ItemResponseType.SingleSelection,
    responseValues: {
      options: [
        {
          id: 'single-select-option-1',
          text: 'Never',
          image:
            'https://wdfiles.ru/plugins/imageviewer/site/thumb.php?s=de02fcf&/Frame_26086022.png',
          tooltip: 'Never',
        },
        {
          id: 'single-select-option-2',
          text: 'Sometimes',
          image:
            'https://wdfiles.ru/plugins/imageviewer/site/thumb.php?s=0aa4332&/Frame_26086023.png',
          tooltip: 'Sometimes',
        },
        {
          id: 'single-select-option-3',
          text: 'Often',
          image:
            'https://wdfiles.ru/plugins/imageviewer/site/thumb.php?s=8680fe9&/Frame_26086024.png',
        },
      ],
    },
  },
  answer: {
    text: '',
    value: 2,
  },
};

export const multipleSelectionMocked: MultiSelectItemAnswer = {
  activityItem: {
    id: 'multiple-select-1',
    name: 'multiple-select-1',
    question: { en: '<p>Do you like how the respondent passed the review?<p>' },
    allowEdit: true,
    config: {
      removeBackButton: false,
      skippableItem: false,
      randomizeOptions: false,
      addScores: false,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      timer: 0,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
    },
    responseType: ItemResponseType.MultipleSelection,
    responseValues: {
      options: [
        {
          id: 'multiple-select-option-1',
          text: 'Never',
        },
        {
          id: 'multiple-select-option-2',
          text: 'Sometimes',
        },
        {
          id: 'multiple-select-option-3',
          text: 'Often',
          tooltip: 'Often',
        },
        {
          id: 'multiple-select-option-4',
          text: 'None',
        },
      ],
    },
  },
  answer: {
    text: '',
    value: [],
  },
};

export const assessmentActivityItems = [
  sliderMocked,
  singleSelectionMocked,
  multipleSelectionMocked,
];
