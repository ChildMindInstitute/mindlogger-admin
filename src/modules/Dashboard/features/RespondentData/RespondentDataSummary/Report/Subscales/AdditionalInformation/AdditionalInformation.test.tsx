// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AdditionalInformation } from './AdditionalInformation';

const mockedOptionText = 'This is additional information';
const mockedLinkOptionText = 'https://example.com';
const mockedLinkResponse = 'This is the response from the link API';

jest.mock('./AdditionalInformation.styles', () => ({
  ...jest.requireActual('./AdditionalInformation.styles'),
  StyledMdPreview: ({ modelValue, 'data-testid': dataTestid }) => (
    <div data-testid={dataTestid}>{modelValue}</div>
  ),
}));

describe('AdditionalInformation component', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('renders AdditionalInformation component with regular text', () => {
    renderWithProviders(<AdditionalInformation optionText={mockedOptionText} />);

    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getByText(mockedOptionText)).toBeInTheDocument();
  });

  test('renders AdditionalInformation component with link and fetches additional information', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: mockedLinkResponse,
    });

    renderWithProviders(<AdditionalInformation optionText={mockedLinkOptionText} />);

    expect(screen.getByText('Additional Information')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(1, mockedLinkOptionText);
    });

    expect(screen.getByText(mockedLinkResponse)).toBeInTheDocument();
  });
});
