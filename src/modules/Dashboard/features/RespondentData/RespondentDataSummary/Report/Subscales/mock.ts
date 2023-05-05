import { SubscalesTypes } from './Subscales.types';

export const scores = {
  reviewDate: new Date(2023, 4, 28, 13, 49, 32),
  finalSubscaleScore: 13,
  frequency: 1,
  additionalInformation: {
    tooltip:
      'The MindLogger mobile app platform was created by Arno Klein and developed by the MATTER Lab.',
    description:
      // eslint-disable-next-line quotes
      "The MindLogger mobile app platform was created by Arno Klein and developed by the **MATTER Lab**. Primary funding for the MindLogger project is provided by the **Child Mind Institute**, a nonprofit dedicated to children's mental health. Additional financial and feature support has been provided by the Learning Planet Institute in Paris, Hearst Foundations, NIMH, MIT, ETH Library Lab in Geneva, and Blanca & Sunil Hirani.",
  },
  subscaleScores: [
    {
      label: 'Subscale one',
      score: 18,
    },
    {
      label: 'Subscale two',
      score: 8,
    },
    {
      label: 'Subscale three',
      score: 22,
    },
    {
      label: 'Subscale four',
      score: 11,
    },
    {
      label: 'Final Subscale Score',
      score: 13,
    },
  ],
};

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
