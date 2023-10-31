import { Sex, SubscaleTotalScore } from 'shared/consts';

import {
  getSubScaleScore,
  parseSex,
  calcScores,
  calcTotalScore,
  getSubscales,
} from './getSubscales';

const totalScoresTableData = [
  {
    rawScore: '0 ~ 4',
    optionalText: 'Description #1 for range 0~4',
  },
  {
    rawScore: '4 ~ 20',
    optionalText: 'Description #2 for range 4~20',
  },
  {
    rawScore: '-10 ~ 0',
    optionalText: 'Description #3 for range -10~0',
  },
];
const subscale1 = {
  name: 'ss-1',
  scoring: SubscaleTotalScore.Sum,
  items: [
    {
      name: 'single',
      type: 'item',
    },
    {
      name: 'multi',
      type: 'item',
    },
    {
      name: 'slider',
      type: 'item',
    },
  ],
  subscaleTableData: [
    {
      score: '2',
      rawScore: '1',
      age: 15,
      sex: 'M',
      optionalText: 'Description 1',
    },
    {
      score: '4',
      rawScore: '2',
      age: 15,
      sex: 'M',
      optionalText: 'Description 2',
    },
    {
      score: '6',
      rawScore: '3',
      age: 15,
      sex: 'M',
      optionalText: 'Markdown Text Here',
    },
    {
      score: '8',
      rawScore: '4',
      age: 15,
      sex: 'F',
      optionalText: 'Good',
    },
    {
      score: '10',
      rawScore: '5',
      age: 15,
      sex: null,
      optionalText: 'Awesome text',
    },
  ],
};
const subscale2 = {
  name: 'ss-2',
  scoring: 'sum',
  items: [
    {
      name: 'ss-1',
      type: 'subscale',
    },
    {
      name: 'single',
      type: 'item',
    },
  ],
  subscaleTableData: [
    {
      score: '2',
      rawScore: '1',
      age: 15,
      sex: 'M',
      optionalText: 'Description 1',
    },
    {
      score: '4',
      rawScore: '2',
      age: 15,
      sex: 'M',
      optionalText: 'Description 2',
    },
    {
      score: '6',
      rawScore: '3',
      age: 15,
      sex: 'M',
      optionalText: 'Markdown Text Here',
    },
    {
      score: '8',
      rawScore: '4',
      age: 15,
      sex: 'F',
      optionalText: 'Good',
    },
    {
      score: '10',
      rawScore: '5',
      age: 15,
      sex: null,
      optionalText: 'Awesome text',
    },
  ],
};
const subscaleSetting = {
  calculateTotalScore: SubscaleTotalScore.Sum,
  subscales: [subscale1, subscale2],
  totalScoresTableData,
};
const itemsAndSubscales = [subscale1, subscale2];
const itemsOnly = [subscale1];

const items = [
  {
    question: 'single',
    responseType: 'singleSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: '4bae594b-4385-402c-aa96-0f6438e7e642',
          text: 'opt1',
          image: null,
          score: 3,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 0,
        },
        {
          id: 'b8b0a211-7f30-48af-bee5-54cbf53889bd',
          text: 'opt2',
          image: null,
          score: 5,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 1,
        },
        {
          id: '3c75fa7f-3ae9-4b4f-ab29-81664418c430',
          text: 'opt3',
          image: null,
          score: 1,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 2,
        },
      ],
    },
    config: {
      removeBackButton: false,
      skippableItem: false,
      randomizeOptions: false,
      timer: 0,
      addScores: true,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      addTokens: null,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
    },
    name: 'single',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: 'e3d95ec0-32cd-4dff-8f81-6a0debfe7099',
  },
  {
    question: 'multi',
    responseType: 'multiSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: 'e6f6b1c1-3ec2-45b2-8c34-6d0970b86d64',
          text: 'opt1',
          image: null,
          score: 1,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 0,
        },
        {
          id: 'a64abb45-1ba3-4113-88b1-5e28459755dc',
          text: 'opt2',
          image: null,
          score: 3,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 1,
        },
        {
          id: '1ce9e52d-28b3-4768-846c-83e378db59ef',
          text: 'opt3',
          image: null,
          score: 0,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 2,
        },
      ],
    },
    config: {
      removeBackButton: false,
      skippableItem: false,
      randomizeOptions: false,
      timer: 0,
      addScores: true,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      addTokens: null,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
    },
    name: 'multi',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: '16a50393-7952-4fcb-8e3b-5f042ab05ed9',
  },
  {
    question: 'slider',
    responseType: 'slider',
    responseValues: {
      minLabel: 'min',
      maxLabel: 'max',
      minValue: 0,
      maxValue: 5,
      minImage: null,
      maxImage: null,
      scores: [1, 2, 3, 4, 5, 6],
      alerts: null,
    },
    config: {
      removeBackButton: false,
      skippableItem: false,
      addScores: true,
      setAlerts: false,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
      showTickMarks: false,
      showTickLabels: false,
      continuousSlider: false,
      timer: 0,
    },
    name: 'slider',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: true,
    id: '42231d03-316b-42e3-8c9b-cd117c916e6d',
  },
  {
    question: 'How do you describe yourself?',
    responseType: 'singleSelect',
    responseValues: {
      paletteName: null,
      options: [
        {
          id: '4a80acc2-d2cb-4dc5-b518-4fee6e4d7c0d',
          text: 'Male',
          image: null,
          score: null,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 0,
        },
        {
          id: '60fff102-0e8d-458f-984a-65d737230e55',
          text: 'Female',
          image: null,
          score: null,
          tooltip: null,
          isHidden: false,
          color: null,
          alert: null,
          value: 1,
        },
      ],
    },
    config: {
      removeBackButton: false,
      skippableItem: false,
      randomizeOptions: false,
      timer: 0,
      addScores: false,
      setAlerts: false,
      addTooltip: false,
      setPalette: false,
      addTokens: null,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
    },
    name: 'gender_screen',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: false,
    id: 'ac8643f5-3c98-4ce7-b94c-8735a8bd2943',
  },
  {
    question: 'How old are you?',
    responseType: 'text',
    responseValues: null,
    config: {
      removeBackButton: false,
      skippableItem: false,
      maxResponseLength: 300,
      correctAnswerRequired: false,
      correctAnswer: '',
      numericalResponseRequired: false,
      responseDataIdentifier: false,
      responseRequired: false,
      isIdentifier: null,
    },
    name: 'age_screen',
    isHidden: false,
    conditionalLogic: null,
    allowEdit: false,
    id: '028d9ee5-68cc-4c6f-9e13-60e7aa52a412',
  },
];

const activityItems = {
  single: {
    activityItem: {
      question: 'single',
      responseType: 'singleSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: '4bae594b-4385-402c-aa96-0f6438e7e642',
            text: 'opt1',
            image: null,
            score: 3,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
          {
            id: 'b8b0a211-7f30-48af-bee5-54cbf53889bd',
            text: 'opt2',
            image: null,
            score: 5,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 1,
          },
          {
            id: '3c75fa7f-3ae9-4b4f-ab29-81664418c430',
            text: 'opt3',
            image: null,
            score: 1,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 2,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: 0,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        addTokens: null,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
      },
      name: 'single',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'e3d95ec0-32cd-4dff-8f81-6a0debfe7099',
    },
    answer: {
      value: 2,
      text: null,
    },
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'aleksandr.i.eremin@yandex.ru',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting,
  },
  multi: {
    activityItem: {
      question: 'multi',
      responseType: 'multiSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: 'e6f6b1c1-3ec2-45b2-8c34-6d0970b86d64',
            text: 'opt1',
            image: null,
            score: 1,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
          {
            id: 'a64abb45-1ba3-4113-88b1-5e28459755dc',
            text: 'opt2',
            image: null,
            score: 3,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 1,
          },
          {
            id: '1ce9e52d-28b3-4768-846c-83e378db59ef',
            text: 'opt3',
            image: null,
            score: 0,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 2,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: 0,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        addTokens: null,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
      },
      name: 'multi',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '16a50393-7952-4fcb-8e3b-5f042ab05ed9',
    },
    answer: {
      value: [0],
      text: null,
    },
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'aleksandr.i.eremin@yandex.ru',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting,
  },
  slider: {
    activityItem: {
      question: 'slider',
      responseType: 'slider',
      responseValues: {
        minLabel: 'min',
        maxLabel: 'max',
        minValue: 0,
        maxValue: 5,
        minImage: null,
        maxImage: null,
        scores: [1, 2, 3, 4, 5, 6],
        alerts: null,
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        addScores: true,
        setAlerts: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        showTickMarks: false,
        showTickLabels: false,
        continuousSlider: false,
        timer: 0,
      },
      name: 'slider',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '42231d03-316b-42e3-8c9b-cd117c916e6d',
    },
    answer: {
      value: 2,
      text: null,
    },
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'aleksandr.i.eremin@yandex.ru',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting,
  },
  gender_screen: {
    activityItem: {
      question: 'How do you describe yourself?',
      responseType: 'singleSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: '4a80acc2-d2cb-4dc5-b518-4fee6e4d7c0d',
            text: 'Male',
            image: null,
            score: null,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
          {
            id: '60fff102-0e8d-458f-984a-65d737230e55',
            text: 'Female',
            image: null,
            score: null,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 1,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: 0,
        addScores: false,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        addTokens: null,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
      },
      name: 'gender_screen',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: 'ac8643f5-3c98-4ce7-b94c-8735a8bd2943',
    },
    answer: {
      value: 0,
      text: null,
    },
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'aleksandr.i.eremin@yandex.ru',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting,
  },
  age_screen: {
    activityItem: {
      question: 'How old are you?',
      responseType: 'text',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        maxResponseLength: 300,
        correctAnswerRequired: false,
        correctAnswer: '',
        numericalResponseRequired: false,
        responseDataIdentifier: false,
        responseRequired: false,
        isIdentifier: null,
      },
      name: 'age_screen',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: false,
      id: '028d9ee5-68cc-4c6f-9e13-60e7aa52a412',
    },
    answer: '25',
    id: '8daa8ec9-7c54-4a51-a87f-f5a14b1294d3',
    submitId: '710aad0b-40c9-4145-8d0d-06f4e4fdf77e',
    version: '1.2.0',
    respondentId: '835e5277-5949-4dff-817a-d85c17a3604f',
    respondentSecretId: 'aleksandr.i.eremin@yandex.ru',
    legacyProfileId: null,
    scheduledDatetime: null,
    startDatetime: 1698673918.439,
    endDatetime: 1698673935.278,
    migratedDate: null,
    appletHistoryId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc_1.2.0',
    activityHistoryId: 'eb521f27-5ccb-4286-97ce-704793294015_1.2.0',
    flowHistoryId: null,
    flowName: null,
    reviewedAnswerId: null,
    createdAt: '2023-10-30T13:52:16.448210',
    appletId: 'fd913b3f-704c-4425-96d5-5386cefaf5cc',
    activityId: 'eb521f27-5ccb-4286-97ce-704793294015',
    flowId: null,
    items,
    activityName: 'New Activity#SimpleItems-3 (No skippable)',
    subscaleSetting,
  },
};
const subscaleItems = [
  {
    name: 'single',
    type: 'item',
  },
  {
    name: 'multi',
    type: 'item',
  },
  {
    name: 'slider',
    type: 'item',
  },
  {
    name: 'gender_screen',
    type: 'item',
  },
];
const subscaleWithoutTypeItems = subscaleItems.map((item) => ({ ...item, type: undefined }));

const data = {
  name: 'finalSubScale',
  items: subscaleItems,
  scoring: SubscaleTotalScore.Sum,
  subscaleTableData: null,
};

const subscaleObject = {
  'ss-1': subscale1,
  'ss-2': subscale2,
};

const itemsWithOptTextExpected = {
  [data.name]: { optionText: 'Description #2 for range 4~20', score: 5 },
};
const itemsWithoutOptTextExpected = {
  [data.name]: { optionText: '', score: 5 },
};
const emptyItemsWithOptTextExpected = {
  [data.name]: { optionText: 'Description #1 for range 0~4', score: 0 },
};
const emptyItemsWithoutOptTextExpected = {
  [data.name]: { optionText: '', score: 0 },
};
const itemsWithoutTypeExpected = {
  [data.name]: { optionText: 'Description #1 for range 0~4', score: 0 },
};
const filledSubscaleScores = {
  'Final SubScale Score': 5,
  'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
  'ss-1': 5,
  'ss-2': 6,
};
const itemsOnlyfilledSubscaleScores = {
  'Final SubScale Score': 5,
  'Optional text for Final SubScale Score': 'Description #2 for range 4~20',
  'ss-1': 5,
};

describe('getSubscales', () => {
  describe('getSubScaleScore', () => {
    test.each`
      subscalesSum | type                          | length | expected
      ${5}         | ${SubscaleTotalScore.Sum}     | ${2}   | ${5}
      ${5}         | ${SubscaleTotalScore.Average} | ${2}   | ${2.5}
      ${5}         | ${SubscaleTotalScore.Average} | ${0}   | ${0}
    `(
      'returns "$expected" when subscalesSum="$subscalesSum", type="$type"',
      ({ subscalesSum, type, length, expected }) => {
        expect(getSubScaleScore(subscalesSum, type, length)).toBe(expected);
      },
    );
  });
  describe('parseSex', () => {
    test.each`
      sex          | expected
      ${Sex.M}     | ${'0'}
      ${Sex.F}     | ${'1'}
      ${''}        | ${'1'}
      ${undefined} | ${'1'}
      ${null}      | ${'1'}
    `('returns "$expected" when sex="$sex", type="$type"', ({ sex, expected }) => {
      expect(parseSex(sex)).toBe(expected);
    });
  });

  describe('calcScores', () => {
    test.each`
      subscaleItems               | subscaleTableData       | expected                            | description
      ${subscaleItems}            | ${totalScoresTableData} | ${itemsWithOptTextExpected}         | ${'should return score=5'}
      ${subscaleItems}            | ${null}                 | ${itemsWithoutOptTextExpected}      | ${'should return score=5 without opt text'}
      ${[]}                       | ${totalScoresTableData} | ${emptyItemsWithOptTextExpected}    | ${'should return score=0'}
      ${[]}                       | ${null}                 | ${emptyItemsWithoutOptTextExpected} | ${'should return score=0 without opt text'}
      ${subscaleWithoutTypeItems} | ${totalScoresTableData} | ${itemsWithoutTypeExpected}         | ${'should return score=0'}
    `('$description', ({ subscaleItems, subscaleTableData, expected }) => {
      const subscaleData = { ...data, subscaleTableData, items: subscaleItems };
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      expect(calcScores(subscaleData, activityItems, subscaleObject, {})).toEqual(expected);
    });
  });

  describe('calcTotalScore', () => {
    test.each`
      subscaleSetting    | activityItems    | expected                         | description
      ${subscaleSetting} | ${activityItems} | ${itemsWithOptTextExpected}      | ${'should return score=5'}
      ${subscaleSetting} | ${{}}            | ${emptyItemsWithOptTextExpected} | ${'should return score=0'}
      ${{}}              | ${activityItems} | ${{}}                            | ${'should return empty object'}
      ${{}}              | ${{}}            | ${{}}                            | ${'should return empty object'}
      ${null}            | ${null}          | ${{}}                            | ${'should return empty object'}
    `('$description', ({ subscaleSetting, activityItems, expected }) => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      expect(calcTotalScore(subscaleSetting, activityItems)).toEqual(expected);
    });
  });

  describe('getSubscales', () => {
    test.each`
      subscales            | activityItems    | expected                         | description
      ${itemsAndSubscales} | ${activityItems} | ${filledSubscaleScores}          | ${'should return filled scores: items and subscale'}
      ${itemsOnly}         | ${activityItems} | ${itemsOnlyfilledSubscaleScores} | ${'should return filled scores: items only'}
      ${itemsAndSubscales} | ${{}}            | ${{}}                            | ${'should return empty object'}
      ${{}}                | ${activityItems} | ${{}}                            | ${'should return empty object'}
      ${{}}                | ${{}}            | ${{}}                            | ${'should return empty object'}
      ${null}              | ${null}          | ${{}}                            | ${'should return empty object'}
    `('$description', ({ subscales, activityItems, expected }) => {
      const settings = {
        ...subscaleSetting,
        subscales,
      };
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      expect(getSubscales(settings, activityItems)).toEqual(expected);
    });
  });
});
