// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { page } from 'resources';
import { mockedAppletFormData, mockedAppletId } from 'shared/mock';

import { AboutApplet } from './AboutApplet';

const route = `/builder/${mockedAppletId}/about`;
const routePath = page.builderAppletAbout;

describe('AboutApplet', () => {
  test('should validate applet name', async () => {
    renderWithAppletFormData({
      children: <AboutApplet />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    const appletName = screen.getByLabelText('Applet Name');
    fireEvent.change(appletName, { target: { value: '' } });

    await waitFor(() => expect(screen.getByText('Applet Name is required')).toBeInTheDocument());
  });
});
