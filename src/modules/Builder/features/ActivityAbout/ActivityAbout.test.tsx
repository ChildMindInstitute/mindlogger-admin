// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { page } from 'resources';
import { mockedActivityId, mockedAppletFormData, mockedAppletId } from 'shared/mock';

import { ActivityAbout } from './ActivityAbout';

const route = `/builder/${mockedAppletId}/activities/${mockedActivityId}/about`;
const routePath = page.builderAppletActivityAbout;

describe('ActivityAbout', () => {
  test('shouldn\'t turn activity to reviewer one', () => {
    renderWithAppletFormData({
      children: <ActivityAbout />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    expect(
      screen.getByLabelText('Turn the Activity to the Reviewer dashboard assessment'),
    ).toBeDisabled();
  });

  test('should validate activity name', async () => {
    renderWithAppletFormData({
      children: <ActivityAbout />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    const appletName = screen.getByLabelText('Activity Name');
    fireEvent.change(appletName, { target: { value: '' } });

    await waitFor(() => expect(screen.getByText('Activity Name is required')).toBeInTheDocument());
  });
});
