import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AddIndividualSchedulePopup } from './AddIndividualSchedulePopup';

const onCloseMock = vi.fn();
const dataTestid = 'add-individual-schedule-popup';
const testAppletId = 'test-applet-id';
const testUserId = 'test-user-id';

const basicProps = {
  'data-testid': dataTestid,
  appletId: testAppletId,
  onClose: onCloseMock,
  open: true,
  userId: testUserId,
  userName: 'John Doe',
};

describe('AddIndividualSchedulePopup', () => {
  beforeEach(() => {
    renderWithProviders(<AddIndividualSchedulePopup {...basicProps} />);
  });

  test('should render', () => {
    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });

  describe('When pressing cancel', () => {
    test('Should call onClose', () => {
      fireEvent.click(screen.getByText('Cancel'));
      expect(onCloseMock).toBeCalled();
    });
  });

  describe('When pressing Confirm', () => {
    beforeEach(() => {
      mockAxios.post.mockResolvedValueOnce(null);
    });

    test('Should call the appropriate endpoint', () => {
      fireEvent.click(screen.getByText('Confirm'));

      expect(mockAxios.post).toBeCalledWith(
        `/applets/${testAppletId}/events/individual/${testUserId}`,
        {},
        { signal: undefined },
      );
    });

    test('Renders the appropriate content', async () => {
      fireEvent.click(screen.getByText('Confirm'));

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        expect(onCloseMock).toBeCalled();
      });
    });
  });
});
