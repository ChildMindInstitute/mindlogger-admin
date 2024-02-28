import { getAllSubscalesToRender } from './Subscales.utils';

const activityItems = {
  single: {
    activityItem: {
      question: {
        en: 'single',
      },
      responseType: 'singleSelect',
      responseValues: {
        paletteName: null,
        options: [
          {
            id: 'd33c397c-8563-497a-b3d7-37be989c6546',
            text: 'a',
            image: null,
            score: 0,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
          {
            id: '4ffedb59-0041-4128-a960-2639f015807f',
            text: 'b',
            image: null,
            score: 1,
            tooltip: null,
            isHidden: false,
            color: null,
            alert: 'B option is selected for Single',
            value: 1,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: 0,
        addScores: true,
        setAlerts: true,
        addTooltip: false,
        setPalette: false,
        addTokens: null,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: false,
      },
      name: 'single',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'c7c88130-7118-4c68-a18d-0e416ba859b2',
      order: 1,
    },
    answer: {
      value: 1,
      text: null,
    },
    items: [],
  },
  slider: {
    activityItem: {
      question: {
        en: 'slider',
      },
      responseType: 'slider',
      responseValues: {
        minLabel: '',
        maxLabel: '',
        minValue: 0,
        maxValue: 12,
        minImage: null,
        maxImage: null,
        scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
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
        showTickMarks: true,
        showTickLabels: true,
        continuousSlider: false,
        timer: 0,
      },
      name: 'slider',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46',
      order: 3,
    },
    answer: {
      value: 3,
      text: null,
    },
    items: [],
  },
  text: {
    activityItem: {
      question: {
        en: 'text',
      },
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
      name: 'text',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: 'eabc4426-7f37-44ea-9a67-c539011bef71',
      order: 4,
    },
    answer: 'web',
    items: [],
  },
  numberSelection: {
    activityItem: {
      question: {
        en: 'numberSelection',
      },
      responseType: 'numberSelect',
      responseValues: {
        minValue: 0,
        maxValue: 21,
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
      },
      name: 'numberSelection',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '7ffbb25c-77fa-44cd-917c-f65710d3c0f7',
      order: 5,
    },
    answer: {
      value: 16,
      text: null,
    },
    items: [],
  },
};
const firstSubscale = {
  name: 'Subscale_SUM',
  scoring: 'sum',
  items: [
    {
      name: 'single',
      type: 'item',
    },
    {
      name: 'multiple',
      type: 'item',
    },
    {
      name: 'slider',
      type: 'item',
    },
  ],
  subscaleTableData: null,
};
const secondSubscale = {
  name: 'Subscale_Average',
  scoring: 'average',
  items: [
    {
      name: 'single',
      type: 'item',
    },
    {
      name: 'multiple',
      type: 'item',
    },
    {
      name: 'slider',
      type: 'item',
    },
  ],
  subscaleTableData: null,
};
const item = {
  decryptedAnswer: [
    {
      activityItem: {
        question: {
          en: 'single',
        },
        responseType: 'singleSelect',
        responseValues: {
          paletteName: null,
          options: [
            {
              id: 'd33c397c-8563-497a-b3d7-37be989c6546',
              text: 'a',
              image: null,
              score: 0,
              tooltip: null,
              isHidden: false,
              color: null,
              alert: null,
              value: 0,
            },
            {
              id: '4ffedb59-0041-4128-a960-2639f015807f',
              text: 'b',
              image: null,
              score: 1,
              tooltip: null,
              isHidden: false,
              color: null,
              alert: 'B option is selected for Single',
              value: 1,
            },
          ],
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          randomizeOptions: false,
          timer: 0,
          addScores: true,
          setAlerts: true,
          addTooltip: false,
          setPalette: false,
          addTokens: null,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
          autoAdvance: false,
        },
        name: 'single',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: 'c7c88130-7118-4c68-a18d-0e416ba859b2',
        order: 1,
      },
      answer: {
        value: 1,
        text: null,
      },
      items: [],
    },
    {
      activityItem: {
        question: {
          en: 'slider',
        },
        responseType: 'slider',
        responseValues: {
          minLabel: '',
          maxLabel: '',
          minValue: 0,
          maxValue: 12,
          minImage: null,
          maxImage: null,
          scores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
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
          showTickMarks: true,
          showTickLabels: true,
          continuousSlider: false,
          timer: 0,
        },
        name: 'slider',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46',
        order: 3,
      },
      answer: {
        value: 3,
        text: null,
      },
      items: [],
    },
    {
      activityItem: {
        question: {
          en: 'text',
        },
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
        name: 'text',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: 'eabc4426-7f37-44ea-9a67-c539011bef71',
        order: 4,
      },
      answer: 'web',
      items: [],
    },
    {
      activityItem: {
        question: {
          en: 'numberSelection',
        },
        responseType: 'numberSelect',
        responseValues: {
          minValue: 0,
          maxValue: 21,
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
        },
        name: 'numberSelection',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: '7ffbb25c-77fa-44cd-917c-f65710d3c0f7',
        order: 5,
      },
      answer: {
        value: 16,
        text: null,
      },
      items: [],
    },
  ],
  answerId: 'ab093a35-45ef-4226-9c11-2b0d944c1ebb',
  version: '8.0.1',
  events:
    '8870a6968ad27fcbddca8d86de3113de:2f3d70ac16c10bdc21682879d97ff053ef59d7e791bf3555c685a36ffa1d3d85028c471db52e617e011779810e257bd75bb6b0fc5261ee26d7a38f4b0bdcb3b2d6b63b8251015a5fee0d0a89195afabe800ad9801da3b0df32e2aedbac3795c477f1a777834ca7bc79b247a123cf66e06352106c50e497198de954afb6b66f87229730e813bc20c17c0d4d7fbee86870bf02a4fca4c25e1934f6154c9120c554edb78f25ceedd13710751131e55b5fd9b4a7b1cb51c0b970408305e1977b1b3266976471ebdcf76a8bec6608ab4be091a9aba30a7e34cd2ad81824c381f7c5d1bb168dc43b4bc0c44e65247a282b24c33990cbd6e97a4f4032d36f5f3335330f570fc296f73d7473a134545b2d7a978c26b9efdf8e74bbd4f53bf5051d64e053ecc2a1f585e1e077159d4ee0c83b5e5e5a3d90154e18d0bcd2164d3b106acc90ebcc4efffcb4a737f8ae0f5c7d628416ce32a64fa66331d4e7108ee3ed7ea89d0e5c661d8c9ee8fedf39c4e6c75dce3839c0cbeb3eaff2406858bc329880de5a6b8d9fa9ba1fd38a874a04961e53ec9b90a5c4bc7a7c28174972a1a5dc2072e0b317a782be963440ed38804fb7f51148beb98817a2d2acb302332b73bd4fa2ff0e01f4ff2d1866dbe653d79aaf10d5272cf92dd531207ef36cbd19ce9f0863da071c7507d9c53577583d4c5559bcba450cca7557486f92b9be94ff9d399d075bf13c30e8ef76f7e896f5cb553304ec827c39b26d317d417f55cc3354158a63893cf74a8373a6dbba9e683bae22ea6a477de89131f4343fb7d0d7746593b03136d1f6e04beb3ce41052df143c3498b2e1c220a7cdaf60f230093ec9ce3fc9decc1960d79b625cd6c6bc9c2055b64c1087bdac579b1eb7cda6090875f7a66a43b4f85be2805a6d6a2f61ce02c267dadd2622a728dc19f107060fb6ea066afb505f2e1b7fe4b4351a3aaff7bb4702eb3d75be828aa68e578deae6a6b2b9da8aef2cc10f4ccd4cd7ab7242aa2dbaff132a9def65747144e2731a7e7bf49dcd2a9f1c9f06c9d7d76bcd19048db14802b9833422ab543cdf83394761bb3f7f3d5bd363d57c0d1ba797270fc79db0538f8957f5e7f0fab7b0a3f3cf4436e06d9434054cadb7adc89c136e712edb31a4c5af41382c4b366de84e778c7328636ea62a1a8ef17187bf7710ae625ca6b9af4451925a96bf99af0e41eed325821c19a09c9565e27488fcf417e070c85c0d3f9eddbc73382397a31efdcfde8da28f6b59e52f0aead6d52e7eaeca7636dcf5aedc7ba0a34f12e642b8e6393205922890dd90de0ea4e79457e0507b5d76b8ef7eb9daf7a1b9b9b73c62aa67af297939a61fbebd86686d055ce6a6dce5068098a01db47a0418ec9c41f46f3b8367299c7fa05d1c8aa824418d7ba3ebc9e3b575949bbb64d57bb0fa3a90f0bfb841364b19b61008f343aaf80aee4ddd91e98bd938d4495bfe5653083f867537b3edc3ba33a600bc984710376ca37f26269204fb14bcefd384a236ea247416165a18a77fdbc424e82ef471522203f6a76bdae5a3ff49362f4da3cdac97a570df96d8a98c25e62e80d23a9bc6cb98d2d5670027a9d4946a7302331146e225b51eb0bfd7f94162eb414435eb4c54127869f4a458144da90acb39d6df5cfaa4af16d9b28c1c8865d1d2b2d1a3bee011a39ee34c2489d2cffa083176edff7aa8647d9d221a9ad39c4ea3f11ed52a0ffad597988f5ca2b4bc43a0fe63c422d4727babb9ea5c5f70634f4097',
  startDatetime: '2024-02-26T15:57:07.894000',
  endDatetime: '2024-02-26T15:57:27.344000',
  subscaleSetting: {
    calculateTotalScore: 'sum',
    subscales: [firstSubscale, secondSubscale],
    totalScoresTableData: null,
  },
};
const allSubscalesToRenderInitial = {};
const allSubscalesToRenderFirstSubscaleResult = {
  Subscale_SUM: {
    restScores: {
      multiple: {},
    },
    items: [
      {
        activityItem: {
          id: 'c7c88130-7118-4c68-a18d-0e416ba859b2',
          name: 'single',
          question: {
            en: 'single',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: '4ffedb59-0041-4128-a960-2639f015807f',
                text: 'b',
                value: 0,
              },
              {
                id: 'd33c397c-8563-497a-b3d7-37be989c6546',
                text: 'a',
                value: 1,
              },
            ],
          },
        },
        answers: [
          {
            answer: {
              value: 0,
              text: null,
            },
            date: '2024-02-26T15:57:27.344000',
          },
        ],
      },
      {
        activityItem: {
          id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46',
          name: 'slider',
          question: {
            en: 'slider',
          },
          responseType: 'slider',
          responseValues: {
            options: [
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-0',
                text: 0,
                value: 0,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-1',
                text: 1,
                value: 1,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-2',
                text: 2,
                value: 2,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-3',
                text: 3,
                value: 3,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-4',
                text: 4,
                value: 4,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-5',
                text: 5,
                value: 5,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-6',
                text: 6,
                value: 6,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-7',
                text: 7,
                value: 7,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-8',
                text: 8,
                value: 8,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-9',
                text: 9,
                value: 9,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-10',
                text: 10,
                value: 10,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-11',
                text: 11,
                value: 11,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-12',
                text: 12,
                value: 12,
              },
            ],
          },
        },
        answers: [
          {
            answer: {
              value: 3,
              text: null,
            },
            date: '2024-02-26T15:57:27.344000',
          },
        ],
      },
    ],
  },
};
const allSubscalesToRenderFinalResult = {
  ...allSubscalesToRenderFirstSubscaleResult,
  Subscale_Average: {
    restScores: {
      multiple: {},
    },
    items: [
      {
        activityItem: {
          id: 'c7c88130-7118-4c68-a18d-0e416ba859b2',
          name: 'single',
          question: {
            en: 'single',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                id: '4ffedb59-0041-4128-a960-2639f015807f',
                text: 'b',
                value: 0,
              },
              {
                id: 'd33c397c-8563-497a-b3d7-37be989c6546',
                text: 'a',
                value: 1,
              },
            ],
          },
        },
        answers: [
          {
            answer: {
              value: 0,
              text: null,
            },
            date: '2024-02-26T15:57:27.344000',
          },
        ],
      },
      {
        activityItem: {
          id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46',
          name: 'slider',
          question: {
            en: 'slider',
          },
          responseType: 'slider',
          responseValues: {
            options: [
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-0',
                text: 0,
                value: 0,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-1',
                text: 1,
                value: 1,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-2',
                text: 2,
                value: 2,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-3',
                text: 3,
                value: 3,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-4',
                text: 4,
                value: 4,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-5',
                text: 5,
                value: 5,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-6',
                text: 6,
                value: 6,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-7',
                text: 7,
                value: 7,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-8',
                text: 8,
                value: 8,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-9',
                text: 9,
                value: 9,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-10',
                text: 10,
                value: 10,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-11',
                text: 11,
                value: 11,
              },
              {
                id: '2e7a64f8-f8df-4f7c-9d15-db60b5cc3a46-12',
                text: 12,
                value: 12,
              },
            ],
          },
        },
        answers: [
          {
            answer: {
              value: 3,
              text: null,
            },
            date: '2024-02-26T15:57:27.344000',
          },
        ],
      },
    ],
  },
};

describe('Subscales.utils', () => {
  describe('getAllSubscalesToRender', () => {
    test.each`
      allSubscalesToRender                       | subscale          | expected                                   | description
      ${allSubscalesToRenderInitial}             | ${firstSubscale}  | ${allSubscalesToRenderFirstSubscaleResult} | ${'should return calculation on first subscale'}
      ${allSubscalesToRenderFirstSubscaleResult} | ${secondSubscale} | ${allSubscalesToRenderFinalResult}         | ${'should return all subscales calculated'}
    `('$description', ({ allSubscalesToRender, subscale, expected }) => {
      expect(
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        getAllSubscalesToRender(allSubscalesToRender, item, subscale, activityItems),
      ).toStrictEqual(expected);
    });
  });
});
