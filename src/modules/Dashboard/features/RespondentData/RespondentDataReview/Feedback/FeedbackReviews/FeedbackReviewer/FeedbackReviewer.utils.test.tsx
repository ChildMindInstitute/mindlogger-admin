import { render, screen } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';
import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { getResponseItem } from './FeedbackReviewer.utils';

describe('FeedbackReviewer utils', () => {
  test.each([
    ['SingleSelection', ItemResponseType.SingleSelection, 'reviewer-single-selection-item'],
    ['MultipleSelection', ItemResponseType.MultipleSelection, 'reviewer-multiple-selection-item'],
    ['Slider', ItemResponseType.Slider, 'reviewer-slider-item'],
  ])('should render correct component for %s', (description, responseType, dataTestId) => {
    const activityItem = {
      responseType,
      responseValues: { options: [] },
      config: { continuousSlider: false },
    } as unknown as AssessmentActivityItem['activityItem'];
    const answer = { value: 'some value' } as unknown as AssessmentActivityItem['answer'];

    render(<div>{getResponseItem({ activityItem, answer, items: [] })}</div>);

    expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
  });
});
