// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';

import { mockedTestid, renderItemConfigurationByType } from '../__mocks__';

describe('Item Configuration: Date/Time/Time Range', () => {
  test.each`
    responseType                  | testId                          | header           | content                                                    | description
    ${ItemResponseType.Date}      | ${`${mockedTestid}-date`}       | ${'Date Select'} | ${'The respondent will be able to select the date.'}       | ${'Date is rendered correctly'}
    ${ItemResponseType.Time}      | ${`${mockedTestid}-time`}       | ${'Time'}        | ${'The respondent will be prompted to select a time.'}     | ${'Time is rendered correctly'}
    ${ItemResponseType.TimeRange} | ${`${mockedTestid}-time-range`} | ${'Time Range'}  | ${'The respondent will be prompted to take a time range.'} | ${'Time Range is rendered correctly'}
  `('$description', ({ responseType, testId, header, content }) => {
    renderItemConfigurationByType(responseType);

    const isTimeRange = responseType === ItemResponseType.TimeRange;

    expect(screen.getByTestId(testId)).toBeVisible();

    const title = screen.getByTestId(`${testId}-title`);
    const description = screen.getByTestId(`${testId}-description`);

    expect(title).toBeVisible();
    expect(title).toHaveTextContent(header);

    expect(description).toBeVisible();
    expect(description).toHaveTextContent(content);

    if (isTimeRange) {
      const startTime = screen.getByTestId(`${testId}-input-start`).querySelector('input');
      const endTime = screen.getByTestId(`${testId}-input-end`).querySelector('input');

      [startTime, endTime].forEach(input => {
        expect(input).toBeVisible();
        expect(input).toBeDisabled();
      });

      return;
    }

    const input = screen.getByTestId(`${testId}-input`).querySelector('input');
    expect(input).toBeVisible();
    expect(input).toBeDisabled();
  });
});
