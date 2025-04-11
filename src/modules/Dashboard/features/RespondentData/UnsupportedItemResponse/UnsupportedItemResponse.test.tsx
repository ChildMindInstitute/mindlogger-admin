import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { ItemResponseType } from 'shared/consts';

import { UnsupportedItemResponse } from './UnsupportedItemResponse';

const dataTestid = 'respondents-review-activity-item-response';

const defaultDescription = 'This data type can’t be displayed on this page';
const messageDescription = 'Message does not require response';

describe('UnsupportedItemResponse', () => {
  test.each`
    itemType                                    | expected
    ${ItemResponseType.Date}                    | ${defaultDescription}
    ${ItemResponseType.Audio}                   | ${defaultDescription}
    ${ItemResponseType.AudioPlayer}             | ${defaultDescription}
    ${ItemResponseType.Drawing}                 | ${defaultDescription}
    ${ItemResponseType.Geolocation}             | ${defaultDescription}
    ${ItemResponseType.Photo}                   | ${defaultDescription}
    ${ItemResponseType.Video}                   | ${defaultDescription}
    ${ItemResponseType.TimeRange}               | ${defaultDescription}
    ${ItemResponseType.MultipleSelectionPerRow} | ${defaultDescription}
    ${ItemResponseType.SingleSelectionPerRow}   | ${defaultDescription}
    ${ItemResponseType.SliderRows}              | ${defaultDescription}
    ${ItemResponseType.NumberSelection}         | ${defaultDescription}
    ${ItemResponseType.Message}                 | ${messageDescription}
    ${ItemResponseType.Flanker}                 | ${defaultDescription}
    ${ItemResponseType.StabilityTracker}        | ${defaultDescription}
    ${ItemResponseType.TouchPractice}           | ${defaultDescription}
    ${ItemResponseType.TouchTest}               | ${defaultDescription}
    ${ItemResponseType.ABTrails}                | ${defaultDescription}
    ${ItemResponseType.RequestHealthRecordData} | ${defaultDescription}
  `('Message for $itemType item type', ({ itemType, expected }) => {
    renderWithProviders(<UnsupportedItemResponse itemType={itemType} data-testid={dataTestid} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
