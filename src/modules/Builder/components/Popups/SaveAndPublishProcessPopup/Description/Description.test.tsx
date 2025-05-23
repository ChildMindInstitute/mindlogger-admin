// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { AppletThunkTypePrefix } from 'shared/state/Applet/Applet.thunk';

import { Description } from './Description';
import { SaveAndPublishSteps } from '../SaveAndPublishProcessPopup.types';

const mockDisplayName = 'Mocked Applet Name';
const getPreloadedState = (typePrefix = AppletThunkTypePrefix.Create) => ({
  applet: {
    applet: { typePrefix },
  },
});

vi.mock('modules/Builder/features/SaveAndPublish/SaveAndPublish.hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAppletDataFromForm: () => () => ({
      displayName: mockDisplayName,
    }),
  };
});

describe('Description Component', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  test('nothing is rendered if the step is not of type SaveAndPublishSteps', () => {
    const { container } = renderWithProviders(<Description step={'step'} />, {
      preloadedState: getPreloadedState(),
    });
    expect(container.firstChild).toBeNull();
  });

  test.each`
    step                                      | expectedDescription
    ${SaveAndPublishSteps.AtLeastOneActivity} | ${'At least 1 Activity is required to save and publish the Applet'}
    ${SaveAndPublishSteps.AtLeastOneItem}     | ${'At least 1 Item is required to save and publish the Applet'}
    ${SaveAndPublishSteps.ReportConfigSave}   | ${'Report Configuration not saved. Save it?'}
  `('renders correct description for $step', ({ step, expectedDescription }) => {
    renderWithProviders(<Description step={step} />, { preloadedState: getPreloadedState() });
    expect(screen.getByText(expectedDescription)).toBeInTheDocument();
  });

  test.each`
    step                                | prefix                          | expectedDescription
    ${SaveAndPublishSteps.BeingCreated} | ${AppletThunkTypePrefix.Create} | ${'Your Applet is being created. Please wait...'}
    ${SaveAndPublishSteps.BeingCreated} | ${AppletThunkTypePrefix.Update} | ${'Your Applet is being updated. Please wait...'}
  `(
    'renders correct description for step=$step & prefix=$prefix',
    ({ step, prefix, expectedDescription }) => {
      renderWithProviders(<Description step={step} />, {
        preloadedState: getPreloadedState(prefix),
      });
      expect(screen.getByText(expectedDescription)).toBeInTheDocument();
    },
  );

  test.each`
    step
    ${SaveAndPublishSteps.EmptyRequiredFields}
    ${SaveAndPublishSteps.ErrorsInFields}
    ${SaveAndPublishSteps.Failed}
  `('renders correct description for $step', ({ step }) => {
    renderWithProviders(<Description step={step} />, { preloadedState: getPreloadedState() });
    expect(screen.getByText(/We were not able to upload your applet/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockDisplayName))).toBeInTheDocument(); // applet name
    expect(screen.getByText(/Please double check your applet and try again./)).toBeInTheDocument();

    if (step === SaveAndPublishSteps.EmptyRequiredFields) {
      expect(
        screen.getByText(/Please fill in all required fields marked in red/),
      ).toBeInTheDocument();
    }

    if (step === SaveAndPublishSteps.ErrorsInFields) {
      expect(
        screen.getByText(/Please fix the errors in all fields marked in red/),
      ).toBeInTheDocument();
    }
  });
});
