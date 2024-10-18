import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { page } from 'resources';

import { UploadPopup } from './UploadPopup';

const props = {
  open: true,
  onClose: jest.fn(),
};

const visitsResponse = { data: { visits: ['V1', 'V2', 'V3', 'V4', 'V5'] } };
const usersVisitsResponse = {
  data: {
    result: {
      activityVisits: {},
      answers: [
        {
          userId: 'a1792f7c-6b4f-409a-a231-97ce531cb66d',
          secretUserId: '7ad7d1b5-87ed-46ee-ba9c-94524885d132',
          activityId: '9b1af6f9-8880-473f-8697-ef86a3166b4e',
          activityName: 'Activity2 applet 20072024',
          answerId: 'a69eedae-d1fa-4e17-bf73-a811b4865dbe',
          version: '2.0.0',
          completedDate: '2024-06-24T16:14:00',
        },
        {
          userId: '814de763-4ea0-48d8-8d94-16fd639325d1',
          secretUserId: 'lol_kek',
          activityId: '9b1af6f9-8880-473f-8697-ef86a3166b4e',
          activityName: 'Activity2 applet 20072024',
          answerId: '2081e58f-d459-4ddd-8bef-34bb6746b8e7',
          version: '2.0.0',
          completedDate: '2024-06-25T04:33:00',
        },
      ],
    },
  },
};

describe('UploadPopup', () => {
  test('test CurrentConnectionInfo -> SelectVisits -> Success flow', async () => {
    mockAxios.get.mockResolvedValueOnce(visitsResponse);
    mockAxios.get.mockResolvedValueOnce(usersVisitsResponse);
    mockAxios.post.mockResolvedValueOnce({ data: {} });

    renderWithProviders(<UploadPopup {...props} />, {
      route: `/builder/123/settings/loris-integration`,
      routePath: page.builderAppletSettingsItem,
    });

    expect(screen.getByTestId('loris-upload-popup')).toBeInTheDocument();
    expect(screen.getByText('LORIS Data Upload')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Please confirm that you want to send the newly collected data from this applet to the LORIS project below:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('connection-info')).toBeInTheDocument();
    expect(
      screen.getByText('All respondent data will be decrypted and uploaded to the LORIS database.'),
    ).toBeInTheDocument();

    const cancelButton = screen.getByTestId('loris-upload-popup-left-button');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');
    await userEvent.click(cancelButton);
    expect(props.onClose).toHaveBeenCalled();

    const confirmButton = screen.getByTestId('loris-upload-popup-submit-button');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toHaveTextContent('Confirm');
    await userEvent.click(confirmButton);

    expect(mockAxios.get).toBeCalledWith('/integrations/loris/123/visits', { signal: undefined }); // Failing
    expect(mockAxios.get).toBeCalledWith('/integrations/loris/123/users/visits', {
      signal: undefined,
    });

    const lorisVisits = await screen.findByTestId('loris-visits');
    expect(lorisVisits).toBeInTheDocument();

    expect(
      screen.getByText('Please check if predefined Visit values are correct:'),
    ).toBeInTheDocument();

    expect(lorisVisits.querySelectorAll('th')).toHaveLength(5);
    expect(lorisVisits.querySelectorAll('tbody tr')).toHaveLength(2);

    // change visit value for the first row
    const firstRow = lorisVisits.querySelectorAll('tbody tr')[0] as HTMLElement;
    const selectContainer1 = within(firstRow).getByTestId('loris-visits-select');
    expect(selectContainer1).toBeInTheDocument();
    const select1 = selectContainer1.querySelector('.MuiSelect-select') as Element;
    await userEvent.click(select1);

    const dropdown1 = screen.getByTestId('loris-visits-select-dropdown');
    expect(dropdown1.querySelectorAll('li')).toHaveLength(5); // 5 mocked visits
    await userEvent.click(dropdown1.querySelectorAll('li')[3]);

    // change visit value for the second row
    const secondRow = lorisVisits.querySelectorAll('tbody tr')[1] as HTMLElement;
    const selectContainer2 = within(secondRow).getByTestId('loris-visits-select');
    expect(selectContainer2).toBeInTheDocument();
    const select2 = selectContainer2.querySelector('.MuiSelect-select') as Element;
    await userEvent.click(select2);

    const dropdown2 = screen.getByTestId('loris-visits-select-dropdown');
    await userEvent.click(dropdown2.querySelectorAll('li')[3]);

    const submitButton = screen.getByTestId('loris-upload-popup-submit-button');
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);

    expect(mockAxios.post).toBeCalledWith(
      '/integrations/loris/publish',
      [
        {
          activities: [
            {
              activityId: '9b1af6f9-8880-473f-8697-ef86a3166b4e',
              activityName: 'Activity2 applet 20072024',
              answerId: 'a69eedae-d1fa-4e17-bf73-a811b4865dbe',
              completedDate: '2024-06-24T16:14:00',
              version: '2.0.0',
              visit: 'V4',
            },
          ],
          secretUserId: '7ad7d1b5-87ed-46ee-ba9c-94524885d132',
          userId: 'a1792f7c-6b4f-409a-a231-97ce531cb66d',
        },
        {
          activities: [
            {
              activityId: '9b1af6f9-8880-473f-8697-ef86a3166b4e',
              activityName: 'Activity2 applet 20072024',
              answerId: '2081e58f-d459-4ddd-8bef-34bb6746b8e7',
              completedDate: '2024-06-25T04:33:00',
              version: '2.0.0',
              visit: 'V4',
            },
          ],
          secretUserId: 'lol_kek',
          userId: '814de763-4ea0-48d8-8d94-16fd639325d1',
        },
      ],
      { params: { applet_id: '123' }, signal: undefined },
    );

    expect(
      screen.getByText('If any new data has been collected, it has been uploaded successfully.'),
    ).toBeInTheDocument();
    const okButton = screen.getByRole('button', { name: 'Ok' });
    expect(okButton).toBeInTheDocument();
    await userEvent.click(okButton);

    expect(screen.queryByTestId('applet-settings-loris-integration-popup')).not.toBeInTheDocument();
  });
});
