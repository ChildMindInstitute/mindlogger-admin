import { ItemResponseType } from 'shared/consts';

import { AssessmentActivityItem } from '../RespondentDataReview.types';
import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackAssessment } from './FeedbackAssessment';
import { FeedbackReviewed } from './FeedbackReviewed';
import { getDefaultValue, getTabs, getDefaultFormValues } from './Feedback.utils';

describe('Feedback utils tests', () => {
  describe('getDefaultValue', () => {
    test.each`
      responseType                          | expected | description
      ${ItemResponseType.SingleSelection}   | ${null}  | ${'should return null for ItemResponseType.SingleSelection'}
      ${ItemResponseType.MultipleSelection} | ${[]}    | ${'should return an empty array for ItemResponseType.MultipleSelection'}
      ${ItemResponseType.Slider}            | ${null}  | ${'should return null for ItemResponseType.Slider'}
      ${ItemResponseType.Text}              | ${''}    | ${'should return an empty string for other response types'}
    `('$description', ({ responseType, expected }) => {
      const result = getDefaultValue(responseType);
      expect(result).toEqual(expected);
    });
  });

  describe('getDefaultFormValues', () => {
    test('returns default form values when assessment is empty', () => {
      const defaultValues = getDefaultFormValues();

      expect(defaultValues.newNote).toBe('');
      expect(defaultValues.assessmentItems).toEqual([]);
    });

    test('returns default form values when assessment has items', () => {
      const assessment = [
        {
          activityItem: { id: '1', responseType: 'text' },
          answer: { edited: false, value: 'Answer 1' },
        },
        { activityItem: { id: '2', responseType: 'number' }, answer: { edited: true, value: 42 } },
        {
          activityItem: { id: '3', responseType: 'text' },
          answer: { edited: undefined, value: undefined },
        },
      ] as unknown as AssessmentActivityItem[];

      const defaultValues = getDefaultFormValues(assessment);

      expect(defaultValues.newNote).toBe('');
      expect(defaultValues.assessmentItems.length).toBe(3);
      expect(defaultValues.assessmentItems[0]).toEqual({
        edited: null,
        itemId: '1',
        answers: 'Answer 1',
      });
      expect(defaultValues.assessmentItems[1]).toEqual({
        edited: true,
        itemId: '2',
        answers: 42,
      });
      expect(defaultValues.assessmentItems[2]).toEqual({
        edited: null,
        itemId: '3',
        answers: '',
      });
    });

    test('returns default form values with empty values for missing answer properties', () => {
      const assessment = [
        {
          activityItem: { id: '1', responseType: 'text' },
          answer: null,
        },
      ] as unknown as AssessmentActivityItem[];

      const defaultValues = getDefaultFormValues(assessment);

      expect(defaultValues.assessmentItems.length).toBe(1);
      expect(defaultValues.assessmentItems[0]).toEqual({
        edited: null,
        itemId: '1',
        answers: '',
      });
    });
  });

  describe('getTabs', () => {
    const dataTestid = 'respondents-summary-feedback-tab';
    const setActiveTab = jest.fn();
    const setAssessmentStep = jest.fn();
    const selectedActivity = { id: '1', name: 'activity 1' };
    const assessmentStep = 0;
    const notesTab = {
      labelKey: 'notes',
      id: 'feedback-notes',
      content: <FeedbackNotes activity={selectedActivity} />,
      'data-testid': `${dataTestid}-notes`,
    };

    test('returns correct tabs when assessment is defined', () => {
      const assessment = [
        { id: '1', name: 'Assessment 1' },
        { id: '2', name: 'Assessment 2' },
      ] as unknown as AssessmentActivityItem[];

      const tabs = getTabs(
        selectedActivity,
        setActiveTab,
        assessment,
        assessmentStep,
        setAssessmentStep,
      );

      expect(tabs.length).toBe(3);
      expect(tabs).toEqual([
        notesTab,
        {
          labelKey: 'assessment',
          id: 'feedback-assessment',
          content: (
            <FeedbackAssessment
              setActiveTab={setActiveTab}
              assessmentStep={assessmentStep}
              setAssessmentStep={setAssessmentStep}
            />
          ),
          'data-testid': `${dataTestid}-assessment`,
        },
        {
          labelKey: 'reviewed',
          id: 'feedback-reviewed',
          content: <FeedbackReviewed />,
          'data-testid': `${dataTestid}-reviewed`,
        },
      ]);
    });

    test('returns correct tabs when assessment is undefined', () => {
      const tabs = getTabs(
        selectedActivity,
        setActiveTab,
        undefined,
        assessmentStep,
        setAssessmentStep,
      );

      expect(tabs.length).toBe(1);
      expect(tabs).toEqual([notesTab]);
    });
  });
});
