// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { fireEvent, screen } from '@testing-library/react';

import { page } from 'resources';
import { Roles } from 'shared/consts';
import {
  mockedActivityId,
  mockedApplet,
  mockedAppletFormData,
  mockedAppletId,
  mockedCurrentWorkspace,
} from 'shared/mock';
import { initialStateData } from 'shared/state';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';

import { ScoresAndReports } from './ScoresAndReports';

const route = `/builder/${mockedAppletId}/activities/${mockedActivityId}/settings/scores-and-reports`;
const routePath = page.builderAppletActivitySettingsItem;
const dataTestid = 'builder-activity-settings-scores-and-reports';
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) =>
    children(
      {
        draggableProps: {
          key: {},
          draggableId: {},
          index: {},
          style: {},
          onDragEnd: jest.fn(),
        },
        innerRef: jest.fn(),
      },
      {},
    ),
  Draggable: ({ children }) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
      },
      {},
    ),
  DragDropContext: ({ children }) => children,
}));

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
    applet: {
      ...mockedApplet,
      reportServerIp: 'reportServerIp',
      reportPublicKey: 'reportPublicKey',
    },
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: {
        result: {
          ...mockedApplet,
          reportServerIp: 'reportServerIp',
          reportPublicKey: 'reportPublicKey',
        },
      },
    },
  },
};

describe('ScoreAndReports', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });

  test('should render', () => {
    renderWithAppletFormData({
      children: <ScoresAndReports />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    expect(screen.getByTestId(`${dataTestid}-generate-report`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-score-0`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-section-1`)).toBeInTheDocument();
  });

  test("should show server status 'connected'", () => {
    renderWithAppletFormData({
      children: <ScoresAndReports />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath, preloadedState },
    });

    expect(screen.getByText('Server Status: Connected.')).toBeInTheDocument();
  });

  test('should navigate to server settings by configure server click', () => {
    const settingsRoute = `/builder/${mockedAppletId}/settings/report-configuration`;
    renderWithAppletFormData({
      children: <ScoresAndReports />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    fireEvent.click(screen.getByTestId(`${dataTestid}-configure-server`));

    expect(mockedUseNavigate).nthCalledWith(1, settingsRoute);
  });

  test('should add section report', () => {
    renderWithAppletFormData({
      children: <ScoresAndReports />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    const addSectionBtn = screen.getByText('Add Section');
    fireEvent.click(addSectionBtn);

    expect(screen.getByTestId(`${dataTestid}-section-2`)).toBeInTheDocument();
  });

  test('should remove section and score', () => {
    renderWithAppletFormData({
      children: <ScoresAndReports />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    fireEvent.click(screen.getByTestId(`${dataTestid}-score-0-remove`));

    expect(screen.queryByTestId(`${dataTestid}-score-0`)).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId(`${dataTestid}-section-0-remove`));

    expect(screen.queryByTestId(`${dataTestid}-section-0`)).not.toBeInTheDocument();
  });

  test('should add score report', () => {
    renderWithAppletFormData({
      children: <ScoresAndReports />,
      appletFormData: mockedAppletFormData,
      options: { route, routePath },
    });

    const addScoreBtn = screen.getByText('Add Score');
    fireEvent.click(addScoreBtn);

    expect(screen.getByTestId(`${dataTestid}-score-2`)).toBeInTheDocument();
  });
});
