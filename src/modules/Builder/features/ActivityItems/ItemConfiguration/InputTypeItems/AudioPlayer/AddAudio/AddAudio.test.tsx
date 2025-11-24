import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AddAudio } from './AddAudio';
import { audioPlayerDataTestid } from '../AudioPlayerContent/AudioPlayerContent.const';

const testAddAudio = async () => {
  const addAudioComponent = screen.getByTestId(`${audioPlayerDataTestid}-add`);
  expect(addAudioComponent).toBeInTheDocument();

  const addButton = screen.getByTestId(`${audioPlayerDataTestid}-add`);
  await userEvent.click(addButton);
};

describe('AddAudio component', () => {
  test('renders AddAudio component', async () => {
    renderWithProviders(<AddAudio onUploadAudio={() => {}} onRecordAudio={() => {}} />);
    await testAddAudio();
  });

  test('calls onUploadAudio on menu item click', async () => {
    const mockOnUploadAudio = vi.fn();
    renderWithProviders(<AddAudio onUploadAudio={mockOnUploadAudio} onRecordAudio={() => {}} />);

    await testAddAudio();
    const uploadMenuItem = screen.getByTestId(`${audioPlayerDataTestid}-upload`);
    await userEvent.click(uploadMenuItem);
    expect(mockOnUploadAudio).toHaveBeenCalled();
  });

  test('calls onRecordAudio on menu item click', async () => {
    const mockOnRecordAudio = vi.fn();
    renderWithProviders(<AddAudio onUploadAudio={() => {}} onRecordAudio={mockOnRecordAudio} />);

    await testAddAudio();
    const recordMenuItem = screen.getByTestId(`${audioPlayerDataTestid}-record`);
    await userEvent.click(recordMenuItem);
    expect(mockOnRecordAudio).toHaveBeenCalled();
  });
});
