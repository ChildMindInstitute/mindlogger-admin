// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

// eslint-disable-next-line prettier/prettier
import {
  mockedAppletId,
  mockedActivityId,
  mockedAppletFormData,
  mockedPhrasalTemplateActivityItem,
  mockedParagraphTextActivityItem,
} from 'shared/mock';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { page } from 'resources';

import { PhrasalTemplate } from './PhrasalTemplate';

const appletFormData = {
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      items: [mockedParagraphTextActivityItem, mockedPhrasalTemplateActivityItem],
    },
  ],
};
const route = `/builder/${mockedAppletId}/activities/${mockedActivityId}/items/c17b7b59-8074-4c69-b787-88ea9ea3df5d`;
const routePath = page.builderAppletActivityItem;
const name = 'activities.0.itemws.0';

describe('PhrasalTemplate', () => {
  test('render PhrasalTemplate with Paragraph', () => {
    renderWithAppletFormData({
      children: <PhrasalTemplate name={name} />,
      appletFormData,
      options: { route, routePath },
    });

    const phrasalTemplates = screen.queryAllByDisplayValue('phrasalTemplate');
    expect(phrasalTemplates.length).toBe(1);
  });
});
