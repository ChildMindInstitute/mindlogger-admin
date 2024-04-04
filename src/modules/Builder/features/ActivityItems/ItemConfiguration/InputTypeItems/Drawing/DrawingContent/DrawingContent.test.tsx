// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { mockedAppletId, mockedActivityId, mockedAppletFormData } from 'shared/mock';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { page } from 'resources';

import { DrawingContent } from './DrawingContent';

const mockedDrawingItem = {
  question: {
    en: 'drawing\n',
  },
  responseType: 'drawing',
  responseValues: {
    drawingExample: 'https://some_media_example.jpg',
    drawingBackground: 'https://some_media_background.jpg',
  },
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
    removeUndoButton: false,
    navigationToTop: false,
  },
  name: 'drawing',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: true,
  id: 'e2e611df-02d5-4316-8406-c5d685b94090',
  order: 1,
};
const appletFormData = {
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      items: [mockedDrawingItem],
    },
  ],
};
const route = `/builder/${mockedAppletId}/activities/${mockedActivityId}/items/c17b7b59-8074-4c69-b787-88ea9ea3df5d`;
const routePath = page.builderAppletActivityItem;
const name = 'activities.0.itemws.0';

describe('DrawingContent', () => {
  test('render component with content', () => {
    renderWithAppletFormData({
      children: <DrawingContent name={name} />,
      appletFormData,
      options: { route, routePath },
    });

    expect(
      screen.getByTestId('builder-activity-items-item-configuration-drawing-example'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('builder-activity-items-item-configuration-drawing-background'),
    ).toBeInTheDocument();

    const divideFlag = screen.getByTestId(
      'builder-activity-items-item-configuration-drawing-divide-content-flag',
    );
    expect(divideFlag).toBeInTheDocument();
    expect(divideFlag).toHaveTextContent(
      'Divide the screen equally between the Drawing Example and the Drawing area',
    );
  });
});
