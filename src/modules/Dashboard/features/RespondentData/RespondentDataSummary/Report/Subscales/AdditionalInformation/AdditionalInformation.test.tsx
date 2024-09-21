import { screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { AdditionalInformation } from './AdditionalInformation';

const mockedOptionText = 'This is additional information';
const mockedLinkOptionText = 'https://example.com';
const mockedLinkResponse = 'This is the response from the link API';

jest.mock('./AdditionalInformation.styles', () => ({
  ...jest.requireActual('./AdditionalInformation.styles'),
  StyledMdPreview: ({
    modelValue,
    'data-testid': dataTestid,
  }: {
    modelValue: string;
    'data-testid': string;
  }) => <div data-testid={dataTestid}>{modelValue}</div>,
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

const dataTestId = 'additional-info';

describe('AdditionalInformation component', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: false,
      },
      resetLDContext: jest.fn(),
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test('renders AdditionalInformation component with regular text', () => {
    renderWithProviders(
      <AdditionalInformation
        optionText={mockedOptionText}
        severity={null}
        data-testid={dataTestId}
      />,
    );

    expect(screen.queryByText('Additional Information')).not.toBeNull();
    expect(screen.queryByText(mockedOptionText)).not.toBeNull();
    expect(screen.queryByTestId(`${dataTestId}-severity`)).toBeNull();
  });

  test('renders AdditionalInformation component with severity when enableCahmiSubscaleScoring = true', () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: true,
      },
      resetLDContext: jest.fn(),
    });

    renderWithProviders(
      <AdditionalInformation
        optionText={mockedOptionText}
        severity="Mild"
        data-testid={dataTestId}
      />,
    );
    expect(screen.queryByTestId(`${dataTestId}-severity`)).not.toBeNull();
  });

  test('Does not render severity text when it is not provided', () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableCahmiSubscaleScoring: true,
      },
      resetLDContext: jest.fn(),
    });

    renderWithProviders(
      <AdditionalInformation
        optionText={mockedOptionText}
        severity={null}
        data-testid={dataTestId}
      />,
    );
    expect(screen.queryByTestId(`${dataTestId}-severity`)).toBeNull();
  });

  test('renders AdditionalInformation component with link and fetches additional information', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: mockedLinkResponse,
    });

    renderWithProviders(
      <AdditionalInformation
        optionText={mockedLinkOptionText}
        severity={null}
        data-testid={dataTestId}
      />,
    );

    expect(screen.queryByText('Additional Information')).not.toBeNull();

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(1, mockedLinkOptionText);
    });

    expect(screen.queryByText(mockedLinkResponse)).not.toBeNull();
    expect(screen.queryByTestId(`${dataTestId}-severity`)).toBeNull();
  });
});
