import { SubscalesTypes } from './Subscales.types';

export const subscales = [
  {
    id: '1',
    name: 'Subscale One',
    additionalInformation: {
      description: `**Patient’s features and volnurabilities**
      The MindLogger iOS app and Android app come bundled with a Welcome applet, pictured below, that gives a brief tour of some of MindLogger's many features. You can add existing applets to the MindLogger app or create your own for personal use or for your students, patients, study participants, etc. MindLogger can deliver scheduled reminders, trigger alerts, compute scores, display data, generate reports, and more!`,
    },
    items: [
      {
        id: '11',
        type: SubscalesTypes.Table,
      },
      {
        id: '22',
        name: 'Subscale two',
        items: [
          {
            id: '111',
            additionalInformation: {
              tooltip:
                'You can add existing applets to the MindLogger app or create your own for personal use or for your students, patients, study participants, etc.',
              description:
                '**MindLogger can deliver scheduled reminders, trigger alerts, compute scores, display data, generate reports, and more! For more background information, please see our JMIR publication.**',
            },
            type: SubscalesTypes.Table,
          },
        ],
      },
    ],
  },
];
