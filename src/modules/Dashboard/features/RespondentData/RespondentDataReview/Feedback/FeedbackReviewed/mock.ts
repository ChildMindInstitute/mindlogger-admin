import { assessmentActivityItems } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/mock';
import { ItemResponseType } from 'shared/consts';

import { Reviewer } from './FeedbackReviewed.types';

export const mockedAssessment = assessmentActivityItems;

export const mockedReviewers: Reviewer[] = [
  {
    id: 'reviewer-1',
    fullName: 'Peter Ovcharenko',
    activityItemAnswers: [
      {
        activityItem: {
          id: 'reviewer-1-item-1',
          name: 'reviewer-1-item-1',
          question: '<p>Does the respondent <b>feel good</b>?<p>',
          responseType: ItemResponseType.Slider,
          edited: false,
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
            minLabel: 'Bad',
            minValue: 1,
            maxImage:
              'https://t4.ftcdn.net/jpg/00/84/66/63/360_F_84666330_LoeYCZ5LCobNwWePKbykqEfdQOZ6fipq.jpg',
            maxLabel: 'Great',
            maxValue: 5,
          },
        },
        answer: {
          value: 3,
          text: '',
        },
      },
      {
        activityItem: {
          id: 'reviewer-1-item-2',
          name: 'reviewer-1-item-2',
          question: '<p>Do you like how the respondent passed the review?<p>',
          edited: true,
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
          },
          responseType: ItemResponseType.SingleSelection,
          responseValues: {
            options: [
              {
                id: 'reviewer-1-item-2-option-1',
                text: 'Never',
                image:
                  'https://wdfiles.ru/plugins/imageviewer/site/thumb.php?s=de02fcf&/Frame_26086022.png',
                tooltip: 'Never',
              },
              {
                id: 'reviewer-1-item-2-option-2',
                text: 'Sometimes',
                image:
                  'https://wdfiles.ru/plugins/imageviewer/site/thumb.php?s=0aa4332&/Frame_26086023.png',
                tooltip: 'Sometimes',
              },
              {
                id: 'reviewer-1-item-2-option-3',
                text: 'Often',
                image:
                  'https://wdfiles.ru/plugins/imageviewer/site/thumb.php?s=8680fe9&/Frame_26086024.png',
              },
            ],
          },
        },
        answer: {
          value: 'reviewer-1-item-2-option-3',
          text: '',
        },
      },
    ],
  },
  {
    id: 'reviewer-2',
    fullName: 'Lyudmila Shcneider',
    activityItemAnswers: [
      {
        activityItem: {
          id: 'reviewer-2-item-1',
          name: 'reviewer-2-item-1',
          question: '<p>Do you like how the respondent passed the review?<p>',
          edited: true,
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
                id: 'reviewer-2-item-1-option-1',
                text: 'Never',
              },
              {
                id: 'reviewer-2-item-1-option-2',
                text: 'Sometimes',
              },
              {
                id: 'reviewer-2-item-1-option-3',
                text: 'Often',
                tooltip: 'Often',
              },
              {
                id: 'reviewer-2-item-1-option-4',
                text: 'None',
              },
            ],
          },
        },
        answer: {
          value: ['reviewer-2-item-1-option-1', 'reviewer-2-item-1-option-3'],
          text: '',
        },
      },
    ],
  },
];
