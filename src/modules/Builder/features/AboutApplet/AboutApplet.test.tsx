// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedApplet, mockedAppletFormData, mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { initialStateData } from 'shared/state';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';

import { AboutApplet } from './AboutApplet';

const routePath = page.builderAppletAbout;
const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
  themes: {
    themes: {
      ...initialStateData,
      data: {
        result: [
          {
            name: 'Default',
            logo: null,
            backgroundImage: null,
            primaryColor: '#0067a0',
            secondaryColor: '#fff',
            tertiaryColor: '#404040',
            id: '9b023afd-e5f9-403c-b154-fc8f35fcf3ab',
            public: true,
            allowRename: true,
          },
        ],
      },
    },
  },
};

describe('AboutApplet', () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('should validate applet name', async () => {
    const route = `/builder/${mockedAppletId}/about`;
    renderWithAppletFormData({
      children: <AboutApplet />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    const appletName = screen.getByLabelText('Applet Name');
    fireEvent.change(appletName, { target: { value: '' } });

    await waitFor(() => expect(screen.getByText('Applet Name is required')).toBeInTheDocument());
  });

  test('should render all fields with default values for a editing applet', () => {
    const route = `/builder/${mockedAppletId}/about`;
    renderWithAppletFormData({
      children: <AboutApplet />,
      appletFormData: {
        ...mockedAppletFormData,
        description: 'applet description',
        about: 'about applet',
        themeId: '9b023afd-e5f9-403c-b154-fc8f35fcf3ab',
      },
      options: { route, routePath, preloadedState },
    });

    const appletName = screen.getByLabelText('Applet Name') as HTMLInputElement;
    expect(appletName.value).toBe('dataviz');
    const appletDescription = screen.getByLabelText('Applet Description') as HTMLInputElement;
    expect(appletDescription.value).toBe('applet description');
    const theme = screen.getByLabelText('Applet Color Theme').querySelector('input');
    theme && expect(theme.value).toBe('9b023afd-e5f9-403c-b154-fc8f35fcf3ab');
    const appletAbout = screen.getByTestId('about-applet-about').querySelector('input');
    appletAbout && expect(appletAbout.value).toBe('about applet');
  });

  test('should render all fields for a new applet', () => {
    const route = '/builder/new-applet/about';
    renderWithAppletFormData({
      children: <AboutApplet />,
      appletFormData: { ...mockedAppletFormData, themeId: '9b023afd-e5f9-403c-b154-fc8f35fcf3ab' },
      options: { route, routePath, preloadedState },
    });

    const fieldsDataTestIds = [
      'about-applet-display-name',
      'about-applet-description',
      'about-applet-theme',
      'about-applet-about',
      'about-applet-image',
      'about-applet-watermark',
    ];

    fieldsDataTestIds.forEach((dataTestId) => expect(screen.getByTestId(dataTestId)).toBeInTheDocument());

    const theme = screen.getByLabelText('Applet Color Theme').querySelector('input');
    theme && expect(theme.value).toBe('9b023afd-e5f9-403c-b154-fc8f35fcf3ab');
  });
});
