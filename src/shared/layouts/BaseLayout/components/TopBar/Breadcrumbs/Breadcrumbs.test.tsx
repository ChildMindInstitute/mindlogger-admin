/* eslint-disable quotes */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import * as useBreadcrumbsHooks from './Breadcrumbs.hooks';
import { Breadcrumbs } from './Breadcrumbs';

jest.mock('./Breadcrumbs.hooks', () => ({
  ...jest.requireActual('./Breadcrumbs.hooks'),
  useBreadcrumbs: jest.fn(),
}));

describe('Breadcrumbs Component', () => {
  test('should render breadcrumbs without links when no data is provided', () => {
    jest.spyOn(useBreadcrumbsHooks, 'useBreadcrumbs').mockImplementationOnce(() => []);

    renderWithProviders(<Breadcrumbs />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();

    const breadcrumbsItems = screen.queryAllByTestId('breadcrumbs-item');
    expect(breadcrumbsItems).toHaveLength(0);

    const breadcrumbsLinks = screen.queryAllByTestId('breadcrumbs-link');
    expect(breadcrumbsLinks).toHaveLength(0);
  });

  test('should render breadcrumbs with links and icons', () => {
    const breadcrumbs = [
      {
        icon: 'home',
        label: "Jane Doe's Dashboard",
        navPath: '/dashboard',
      },
      {
        icon: 'applet-outlined',
        label: 'Applets',
        navPath: '/dashboard/applets',
      },
    ];
    jest.spyOn(useBreadcrumbsHooks, 'useBreadcrumbs').mockImplementationOnce(() => breadcrumbs);

    renderWithProviders(<Breadcrumbs />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();

    const breadcrumbsItems = screen.queryAllByTestId('breadcrumbs-item');
    expect(breadcrumbsItems).toHaveLength(1);

    const breadcrumbsLinks = screen.queryAllByTestId('breadcrumbs-link');
    expect(breadcrumbsLinks).toHaveLength(1);

    breadcrumbsLinks.forEach((breadcrumb, index) => {
      const textContent = breadcrumb.textContent;
      expect(textContent).toEqual(breadcrumbs[index].label);

      const svgElement = breadcrumb.querySelector(`.svg-${breadcrumbs[index].icon}`);
      expect(svgElement).toBeInTheDocument();
    });
  });

  test('should render breadcrumbs with custom icons, links, and placeholders', () => {
    const breadcrumbs = [
      {
        image: '',
        label: "Jane Doe's Dashboard",
        navPath: '/dashboard',
      },
      {
        image: 'https://example.com/mocked-image.jpeg',
        useCustomIcon: true,
        label: 'Test Applet',
        navPath: '/dashboard/138304f4-79b5-4c99-81f5-abf21f9d8fa2/respondents',
      },
      {
        useCustomIcon: true,
        label: 'Respondents',
        navPath: '/dashboard/138304f4-79b5-4c99-81f5-abf21f9d8fa2/respondents',
      },
    ];
    jest.spyOn(useBreadcrumbsHooks, 'useBreadcrumbs').mockImplementationOnce(() => breadcrumbs);

    renderWithProviders(<Breadcrumbs />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();

    const breadcrumbsLinks = screen.queryAllByTestId('breadcrumbs-link');
    expect(breadcrumbsLinks).toHaveLength(2);

    const breadcrumbsItems = screen.queryAllByTestId('breadcrumbs-item');
    expect(breadcrumbsItems).toHaveLength(1);

    const [dashboard, applet] = breadcrumbsLinks;

    expect(dashboard.getAttribute('href')).toEqual('/dashboard');

    expect(applet.getAttribute('href')).toEqual(
      '/dashboard/138304f4-79b5-4c99-81f5-abf21f9d8fa2/respondents',
    );

    const appletImg = applet.querySelector('img');
    expect(appletImg.getAttribute('src')).toEqual('https://example.com/mocked-image.jpeg');

    const placeholder = breadcrumbsItems[0].querySelector(
      '[data-testid="breadcrumbs-item-placeholder"]',
    );
    expect(placeholder).toBeInTheDocument();
  });
});
