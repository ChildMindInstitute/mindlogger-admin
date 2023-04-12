import {
  SliderType,
  SingleSelectionType,
  MultipleSelectionType,
} from './ActivityCardItemList/ActivityCartItemList.types';

export const sliderMocked: SliderType = {
  id: 'slider-1',
  question: '<p>Does the respondent <b>feel good</b>?<p>',
  responseType: 'slider',
  answer: [],
  config: {
    continuousSlider: false,
    removeBackButton: false,
    skippableItem: false,
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
};

export const singleSelectionMocked: SingleSelectionType = {
  id: 'single-select-1',
  question: '<p>Do you like how the respondent passed the review?<p>',
  config: {
    removeBackButton: true,
    skippableItem: true,
  },
  responseType: 'singleSelect',
  answer: [],
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
        tooltip: null,
      },
    ],
  },
};

export const multipleSelectionMocked: MultipleSelectionType = {
  id: 'multiple-select-1',
  question: '<p>Do you like how the respondent passed the review?<p>',
  config: {
    removeBackButton: false,
    skippableItem: false,
  },
  responseType: 'multiSelect',
  answer: [],
  responseValues: {
    options: [
      {
        id: 'multiple-select-option-1',
        text: 'Never',
        image: null,
        tooltip: null,
      },
      {
        id: 'multiple-select-option-2',
        text: 'Sometimes',
        image: null,
        tooltip: null,
      },
      {
        id: 'multiple-select-option-3',
        text: 'Often',
        image: null,
        tooltip: 'Often',
      },
      {
        id: 'multiple-select-option-4',
        text: 'None',
        image: null,
        tooltip: null,
      },
    ],
  },
};

export const assessmentActivityItems = [
  sliderMocked,
  singleSelectionMocked,
  multipleSelectionMocked,
];
