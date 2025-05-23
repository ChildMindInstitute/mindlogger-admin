import { screen, fireEvent } from '@testing-library/react';

import * as reduxHooks from 'redux/store/hooks';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { SaveAndPublishProcessPopup } from './SaveAndPublishProcessPopup';
import { SaveAndPublishSteps } from './SaveAndPublishProcessPopup.types';
import { saveAndPublishProcessTestIds } from './SaveAndPublishProcessPopup.const';

vi.mock('redux/store/hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

const mockDispatch = vi.fn();
const mockOnRetry = vi.fn();
const mockOnClose = vi.fn();

const commonProps = {
  isPopupVisible: true,
  onRetry: mockOnRetry,
  onClose: mockOnClose,
};

describe('SaveAndPublishProcessPopup', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders correctly for a beingCreated', () => {
    renderWithProviders(
      <SaveAndPublishProcessPopup step={SaveAndPublishSteps.BeingCreated} {...commonProps} />,
    );

    expect(
      screen.getByTestId(
        `builder-save-and-publish-popup${saveAndPublishProcessTestIds.beingCreated}`,
      ),
    ).toBeInTheDocument();
  });

  test('renders correctly for a reportConfigSave', () => {
    renderWithProviders(
      <SaveAndPublishProcessPopup step={SaveAndPublishSteps.ReportConfigSave} {...commonProps} />,
    );

    expect(
      screen.getByTestId(
        `builder-save-and-publish-popup${saveAndPublishProcessTestIds.reportConfigSave}`,
      ),
    ).toBeInTheDocument();
  });

  test('calls onClose when the close button is clicked', () => {
    renderWithProviders(
      <SaveAndPublishProcessPopup step={SaveAndPublishSteps.Failed} {...commonProps} />,
    );

    fireEvent.click(screen.getByText('Back'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('dispatches correct action on report config save', () => {
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);

    renderWithProviders(
      <SaveAndPublishProcessPopup step={SaveAndPublishSteps.ReportConfigSave} {...commonProps} />,
    );

    fireEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'reportConfig/setReportConfigChanges',
      payload: { saveChanges: true },
    });

    fireEvent.click(screen.getByText("Don't Save"));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'reportConfig/setReportConfigChanges',
      payload: { doNotSaveChanges: true },
    });
  });
});
