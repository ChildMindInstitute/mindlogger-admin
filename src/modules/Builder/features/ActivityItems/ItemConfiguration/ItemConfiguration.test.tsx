// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { mockedAppletFormData, mockedSingleSelectFormValues } from 'shared/mock';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import { ItemResponseType } from 'shared/consts';

import { ItemConfiguration } from './ItemConfiguration';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    appletId: mockedAppletFormData.id,
    activityId: mockedAppletFormData.activities[0].id,
  }),
}));

const mockedOnClose = jest.fn();

const mockedItemName = 'activities.0.items.0';
const mockedEmptyItem = getNewActivityItem();
const getAppletFormDataWithItem = (item) => ({
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      items: [item],
    },
  ],
});

describe('ItemConfiguration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Item Type', () => {
    test.each`
      item                            | expected                            | description
      ${mockedEmptyItem}              | ${undefined}                        | ${'is rendered without value for newly created item'}
      ${mockedSingleSelectFormValues} | ${ItemResponseType.SingleSelection} | ${'is rendered with correct value for existing item'}
    `('$description', ({ item, expected }) => {
      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(item),
      });

      expect(
        screen.getByTestId('builder-activity-items-item-configuration-response-type'),
      ).toBeInTheDocument();

      const input = document.querySelector(
        '[data-testid="builder-activity-items-item-configuration-response-type"] input',
      );
      expected ? expect(input).toHaveValue(expected) : expect(input).not.toHaveValue();
    });
  });
});
