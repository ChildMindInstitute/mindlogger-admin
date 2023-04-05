import { ItemResponseType } from 'shared/consts';

export const mockedCart = [
  {
    accountId: '60d304bbb8d2547327547d2f',
    appletId: '6177f838ca0b5b2015f31320',
    categoryId: null,
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    id: '6177f9e3ca0b5b2015f3132d',
    image: 'https://mindlogger-applet-contents.s3.amazonaws.com/image/ia6cUjbrU7xgfX3BRU1sKx.jpeg',
    keywords: ['multiple owners', 'view all contributions test'],
    name: 'Applet Library Test',
    subCategoryId: null,
    activities: [
      {
        id: '6177f838ca0b5b2015f31320_activity1',
        name: 'Test slider, date, number selection, time range, single selection per row, multiple selection per row, slider rows, text, drawing, photo, video, geolocation, audio, message, audio player response types',
        items: [
          {
            id: '6177f838ca0b5b2015f31320_activity1_item1',
            question: '<p>Test <strong><u>slider</u></strong> item response type<p>',
            responseType: ItemResponseType.Slider,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item2',
            question: 'Test <strong><u>date</u></strong> item response type',
            responseType: ItemResponseType.Date,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item3',
            question: 'Test <strong><u>number selection</u></strong> item response type',
            responseType: ItemResponseType.NumberSelection,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item4',
            question: 'Test <strong><u>time range</u></strong> item response type',
            responseType: ItemResponseType.TimeRange,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item5',
            question: 'Test <strong><u>single selection per row</u></strong> item response type',
            responseType: ItemResponseType.SingleSelectionPerRow,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item6',
            question: 'Test <strong><u>multiple selection per row</u></strong> item response type',
            responseType: ItemResponseType.MultipleSelectionPerRow,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item7',
            question: 'Test <strong><u>slider rows</u></strong> item response type',
            responseType: ItemResponseType.SliderRows,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item8',
            question: 'Test <strong><u>text</u></strong> item response type',
            responseType: ItemResponseType.Text,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item9',
            question: 'Test <strong><u>drawing</u></strong> item response type',
            responseType: ItemResponseType.Drawing,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item10',
            question: 'Test <strong><u>photo</u></strong> item response type',
            responseType: ItemResponseType.Photo,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item11',
            question: 'Test <strong><u>video</u></strong> item response type',
            responseType: ItemResponseType.Video,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item12',
            question: 'Test <strong><u>geolocation</u></strong> item response type',
            responseType: ItemResponseType.Geolocation,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item13',
            question: 'Test <strong><u>audio</u></strong> item response type',
            responseType: ItemResponseType.Audio,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item14',
            question: 'Test <strong><u>message</u></strong> item response type',
            responseType: ItemResponseType.Message,
          },
          {
            id: '6177f838ca0b5b2015f31320_activity1_item15',
            question: 'Test <strong><u>audio player</u></strong> item response type',
            responseType: ItemResponseType.AudioPlayer,
          },
        ],
      },
      {
        id: '6177f838ca0b5b2015f31320_activity2',
        name: 'Test single selection, multiple selection response types',
        items: [
          {
            id: '6177f838ca0b5b2015f31320_activity2_item1',
            question: 'Test <strong><u>single selection</u></strong> item response type',
            responseType: ItemResponseType.SingleSelection,
            options: [
              {
                title:
                  '0 hours (Turning a screen off was the last thing you did before falling asleep. Also includes falling asleep with the screen on.)',
              },
              {
                title: '1/2 hour or less',
              },
              {
                title: '1 hour',
              },
              {
                title: '1-2 hours',
              },
              {
                title: '2-4 hours',
              },
              {
                title: '4-6 hours',
              },
              {
                title: '6-8 hours',
              },
            ],
          },
          {
            id: '6177f838ca0b5b2015f31320_activity2_item2',
            question: 'Test <strong><u>multiple selection</u></strong> item response type',
            responseType: ItemResponseType.MultipleSelection,
            options: [
              {
                title: 'Checking Instagram',
              },
              {
                title: 'Posting on Instagram',
              },
              {
                title: 'Watching TikToks',
              },
              {
                title: 'Making a TikTok',
              },
              {
                title: 'Checking Snapchat',
              },
              {
                title: 'Posting on Snapchat',
              },
              {
                title: 'Facetiming',
              },
              {
                title: 'Texting',
              },
              {
                title: 'Playing a game',
              },
              {
                title: 'Online Shopping',
              },
              {
                title: 'Doing work from another class',
              },
              {
                title: 'Other',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    accountId: '6257ebb23646a059f4f062a2',
    appletId: '6257fbdb3646a059f4f062af',
    categoryId: null,
    description: 'My applet description',
    id: '636544ed64d8af5b305cd29f',
    image: 'https://mindlogger-applet-contents.s3.amazonaws.com/image/jhKcAPaBYj4uzYj3qJ8W3P.jpeg',
    keywords: ['My applet', 'ml_account'],
    name: 'My applet',
    subCategoryId: null,
  },
  {
    accountId: '614c3eb5e913a1a4f2a8b695',
    appletId: '614c4400e913a1a4f2a8b738',
    categoryId: null,
    description:
      'Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    id: '615eec78541ef0ad3d99f2f0',
    image: '',
    keywords: ['multiple item types'],
    name: 'multiple item types',
    subCategoryId: null,
    version: 'v1.5.8',
    activities: [
      {
        id: '614c4400e913a1a4f2a8b738_activity2',
        name: 'Adverse Child Events (ACE) - Self Report (EK)',
        items: [
          {
            id: '614c4400e913a1a4f2a8b738_activity2_item1',
            question:
              '*Please select the intensity level of activities you did today:*\n\n## Header\n\n> test quote\n\n1. test list 1\n2. test list 2\n',
            responseType: ItemResponseType.MultipleSelection,
            options: [
              {
                title: 'Vigorous activities (e.g. running/fast cycling/heavy lifting or digging)',
                image:
                  'https://raw.githubusercontent.com/ChildMindInstitute/ca-partners-content/master/images/new/activityVigorous.png',
              },
              {
                title: 'Moderate activities (e.g. tennis/bicycling/carrying light loads)',
                image:
                  'https://raw.githubusercontent.com/ChildMindInstitute/ca-partners-content/master/images/new/activityModerate.png',
              },
              {
                title: 'Light activities (e.g. walking/climbing stairs/routine household chores)',
                image:
                  'https://raw.githubusercontent.com/ChildMindInstitute/ca-partners-content/master/images/new/activityLight.png',
              },
              {
                title: 'No physical activity today',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    accountId: '62960db77680030fb93f2d80',
    appletId: '629618487680030fb93f31e2',
    categoryId: null,
    description:
      'My applet ML3 description It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distributio',
    id: '62977bf77680030fb93f38ff',
    image: 'https://mindlogger-applet-contents.s3.amazonaws.com/image/7zN2XZ9ptvu7QwtS9ofhD3.jpeg',
    keywords: ['one keyword'],
    name: 'My applet ML3',
    subCategoryId: null,
  },
];
