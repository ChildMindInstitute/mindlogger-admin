// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { CHANGE_DEBOUNCE_VALUE, ItemResponseType } from 'shared/consts';
import { asyncTimeout, renderWithAppletFormData } from 'shared/utils';

import {
  getAppletFormDataWithItem,
  mockedAlertsTestid,
  mockedItemName,
  renderItemConfiguration,
  setItemConfigSetting,
  setItemResponseType,
} from '../__mocks__';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';

const renderSelectionRows = (responseType) => {
  const ref = createRef();

  renderWithAppletFormData({
    children: renderItemConfiguration(),
    appletFormData: getAppletFormDataWithItem(),
    formRef: ref,
  });

  setItemResponseType(responseType);

  return ref;
};
const setOption = (optionNumber) => {
  const select = screen.getByTestId(`${mockedDataTestid}-options-select`);
  fireEvent.mouseDown(select.querySelector('[role="button"]'));

  const options = screen
    .getByTestId(`${mockedDataTestid}-options-select-dropdown`)
    .querySelectorAll('li');
  fireEvent.click(options[optionNumber - 1]);
};
const setAlertOption = (alertIndex, optionIndex) => {
  const optionsSelect = screen
    .getByTestId(`${mockedAlertsTestid}-${alertIndex}-selection-per-row-option`)
    .querySelector('[role="button"]');
  fireEvent.mouseDown(optionsSelect);
  fireEvent.click(
    screen
      .getByTestId(`${mockedAlertsTestid}-${alertIndex}-selection-per-row-option-dropdown`)
      .querySelectorAll('li')[optionIndex],
  );
};
const setAlertRow = (alertIndex, rowIndex) => {
  const rowsSelect = screen
    .getByTestId(`${mockedAlertsTestid}-${alertIndex}-selection-per-row-row`)
    .querySelector('[role="button"]');
  fireEvent.mouseDown(rowsSelect);
  fireEvent.click(
    screen
      .getByTestId(`${mockedAlertsTestid}-${alertIndex}-selection-per-row-row-dropdown`)
      .querySelectorAll('li')[rowIndex],
  );
};

const mockedDataTestid = 'builder-activity-items-item-configuration-selection-rows';
const mockedAddRowTestid = 'builder-activity-items-item-configuration-selection-rows-add-row';

const JEST_TEST_TIMEOUT = 10000;

describe('Item Configuration: Single Selection Per Row/Multi Selection Per Row', () => {
  test.each`
    responseType                                | description
    ${ItemResponseType.SingleSelectionPerRow}   | ${'Single: by default renders with 1 row and 1 option'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'Multi: by default renders with 1 row and 1 option'}
  `('$description', async ({ responseType }) => {
    renderSelectionRows(responseType);

    await waitFor(() => {
      const options = screen.getAllByTestId(
        /^builder-activity-items-item-configuration-selection-rows-option-\d+$/,
      );
      const rows = screen.getAllByTestId(
        /^builder-activity-items-item-configuration-selection-rows-row-\d+$/,
      );

      expect(options).toHaveLength(1);
      expect(rows).toHaveLength(1);
    });
  });

  test.each`
    responseType                                | title                           | description
    ${ItemResponseType.SingleSelectionPerRow}   | ${'Single Selection per Row'}   | ${'Single: renders correctly'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'Multiple Selection per Row'} | ${'Multi: render correctly'}
  `('$description', async ({ responseType, title }) => {
    renderSelectionRows(responseType);

    expect(screen.getByTestId(`${mockedDataTestid}-title`)).toHaveTextContent(title);

    const optionsSelect = screen.getByTestId(`${mockedDataTestid}-options-select`);
    expect(optionsSelect).toBeVisible();

    fireEvent.mouseDown(optionsSelect.querySelector('[role="button"]'));
    const optionsSelectList = screen.getByTestId(`${mockedDataTestid}-options-select-dropdown`);
    expect(optionsSelectList).toBeVisible();

    const optionsSelectListOptions = optionsSelectList.querySelectorAll('li');
    expect(optionsSelectListOptions).toHaveLength(3);

    optionsSelectListOptions.forEach((option, index) => {
      expect(option).toHaveTextContent(`${index + 1}-option${index === 0 ? '' : 's'} Matrix`);
    });

    expect(screen.getByTestId(`${mockedDataTestid}-option-0-image`)).toBeVisible();

    const option = screen.getByTestId(`${mockedDataTestid}-option-0-text`);
    expect(option).toBeVisible();
    expect(option.querySelector('label')).toHaveTextContent('Option 1');

    const row = screen.getByTestId(`${mockedDataTestid}-row-0-text`);
    expect(row).toBeVisible();
    expect(row.querySelector('label')).toHaveTextContent('Row 1');
    expect(
      screen
        .getByTestId(`${mockedDataTestid}-row-0`)
        .querySelector(
          `input[type="${
            responseType === ItemResponseType.SingleSelectionPerRow ? 'radio' : 'checkbox'
          }"]`,
        ),
    ).toBeDisabled();

    const addRow = screen.getByTestId(mockedAddRowTestid);
    expect(addRow).toBeVisible();
    expect(addRow).toHaveTextContent('Add Row');
  });

  test.each`
    responseType                                | description
    ${ItemResponseType.SingleSelectionPerRow}   | ${'Single: options dropdown works correctly'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'Multi: options dropdown works correctly'}
  `('$description', async ({ responseType }) => {
    const ref = renderSelectionRows(responseType);

    setOption(2);
    const twoOptions = screen.getAllByTestId(
      /^builder-activity-items-item-configuration-selection-rows-option-\d+-text$/,
    );
    expect(twoOptions).toHaveLength(2);
    twoOptions.forEach((option, index) => {
      expect(option.querySelector('label')).toHaveTextContent(`Option ${index + 1}`);
    });

    expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toStrictEqual([
      {
        id: ref.current.getValues(`${mockedItemName}.responseValues.options.0.id`),
        text: '',
      },
      {
        id: ref.current.getValues(`${mockedItemName}.responseValues.options.1.id`),
        text: '',
      },
    ]);

    setOption(3);
    const threeOptions = screen.getAllByTestId(
      /^builder-activity-items-item-configuration-selection-rows-option-\d+-text$/,
    );
    expect(threeOptions).toHaveLength(3);
    threeOptions.forEach((option, index) => {
      expect(option.querySelector('label')).toHaveTextContent(`Option ${index + 1}`);
    });

    expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toStrictEqual([
      {
        id: ref.current.getValues(`${mockedItemName}.responseValues.options.0.id`),
        text: '',
      },
      {
        id: ref.current.getValues(`${mockedItemName}.responseValues.options.1.id`),
        text: '',
      },
      {
        id: ref.current.getValues(`${mockedItemName}.responseValues.options.2.id`),
        text: '',
      },
    ]);

    setOption(1);
    const oneOptions = screen.getAllByTestId(
      /^builder-activity-items-item-configuration-selection-rows-option-\d+-text$/,
    );
    expect(oneOptions).toHaveLength(1);
    expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toStrictEqual([
      {
        id: ref.current.getValues(`${mockedItemName}.responseValues.options.0.id`),
        text: '',
      },
    ]);
  });

  test.each`
    responseType                                | description
    ${ItemResponseType.SingleSelectionPerRow}   | ${'Single: add/remove rows works correctly'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'Multi: add/remove rows works correctly'}
  `('$description', async ({ responseType }) => {
    const ref = renderSelectionRows(responseType);

    const addRow = screen.getByTestId(mockedAddRowTestid);
    fireEvent.click(addRow);

    const twoRows = screen.getAllByTestId(
      /^builder-activity-items-item-configuration-selection-rows-row-\d+$/,
    );
    expect(twoRows).toHaveLength(2);
    twoRows.forEach((_, index) => {
      const text = screen.getByTestId(`${mockedDataTestid}-row-${index}-text`);
      expect(text).toHaveTextContent(`Row ${index + 1}`);
    });
    expect(ref.current.getValues(`${mockedItemName}.responseValues.rows`)).toStrictEqual([
      { id: ref.current.getValues(`${mockedItemName}.responseValues.rows.0.id`), rowName: '' },
      { id: ref.current.getValues(`${mockedItemName}.responseValues.rows.1.id`), rowName: '' },
    ]);

    const removeRow = screen.getByTestId(`${mockedDataTestid}-row-1-remove`);
    fireEvent.click(removeRow);

    expect(
      screen.queryByTestId(
        /^builder-activity-items-item-configuration-selection-rows-row-\d+-remove$/,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByTestId(/^builder-activity-items-item-configuration-selection-rows-row-\d+$/),
    ).toHaveLength(1);
    expect(ref.current.getValues(`${mockedItemName}.responseValues.rows`)).toStrictEqual([
      { id: ref.current.getValues(`${mockedItemName}.responseValues.rows.0.id`), rowName: '' },
    ]);
  });

  test.each`
    responseType                                | description
    ${ItemResponseType.SingleSelectionPerRow}   | ${'Single: tooltips'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'Multi: tooltips'}
  `(
    '$description',
    async ({ responseType }) => {
      const ref = renderSelectionRows(responseType);
      await setItemConfigSetting(ItemConfigurationSettings.HasTooltips);

      setOption(2);
      const addRow = screen.getByTestId(mockedAddRowTestid);
      fireEvent.click(addRow);

      const optionTooltips = screen.getAllByTestId(
        /^builder-activity-items-item-configuration-selection-rows-option-\d+-tooltip$/,
      );
      expect(optionTooltips).toHaveLength(2);
      optionTooltips.forEach((option, index) => {
        expect(option.querySelector('label')).toHaveTextContent('Tooltip');
        const dataOption = ref.current.getValues(
          `${mockedItemName}.responseValues.options.${index}`,
        );
        expect(dataOption).toHaveProperty('tooltip');
        expect(dataOption.tooltip).toBeUndefined();
      });

      const rowTooltips = screen.getAllByTestId(
        /^builder-activity-items-item-configuration-selection-rows-row-\d+-tooltip$/,
      );
      expect(rowTooltips).toHaveLength(2);
      rowTooltips.forEach((row, index) => {
        expect(row.querySelector('label')).toHaveTextContent('Tooltip');
        const dataRow = ref.current.getValues(`${mockedItemName}.responseValues.rows.${index}`);
        expect(dataRow).toHaveProperty('tooltip');
        expect(dataRow.tooltip).toBeUndefined();
      });

      const rowTooltip = rowTooltips[0];
      fireEvent.change(rowTooltip.querySelector('input'), { target: { value: 'tooltip' } });
      await asyncTimeout(CHANGE_DEBOUNCE_VALUE);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.rows.0.tooltip`)).toEqual(
        'tooltip',
      );

      const optionTooltip = optionTooltips[1];
      fireEvent.change(optionTooltip.querySelector('input'), { target: { value: 'tooltip' } });
      await asyncTimeout(CHANGE_DEBOUNCE_VALUE);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options.1.tooltip`)).toEqual(
        'tooltip',
      );

      setOption(3);
      expect(screen.getByTestId(`${mockedDataTestid}-option-2-tooltip`)).toBeVisible();

      await setItemConfigSetting(ItemConfigurationSettings.HasTooltips);
      expect(
        screen.queryByTestId(
          /^(builder-activity-items-item-configuration-selection-rows-row-\d+-tooltip|builder-activity-items-item-configuration-selection-rows-option-\d+-tooltip)$/,
        ),
      ).not.toBeInTheDocument();
    },
    JEST_TEST_TIMEOUT,
  );

  describe.each`
    responseType                                | description
    ${ItemResponseType.SingleSelectionPerRow}   | ${'Single: alerts'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'Multi: alerts'}
  `('$description', ({ responseType }) => {
    test('Is rendered correctly', async () => {
      renderSelectionRows(responseType);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      expect(screen.getByText('Alert 1')).toBeVisible();
      expect(
        screen.getByText('If is selected for when answering this question then send:'),
      ).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-remove`)).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-text`));
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-selection-per-row-row`)).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-selection-per-row-option`)).toBeVisible();
    });

    test('Add/remove works correctly', async () => {
      const ref = renderSelectionRows(responseType);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
      fireEvent.click(addAlert);

      expect(screen.getByTestId(`${mockedAlertsTestid}-1-panel`)).toBeVisible();
      expect(ref.current.getValues(`${mockedItemName}.alerts.1.alert`)).toEqual('');

      const removeAlert = screen.getByTestId(`${mockedAlertsTestid}-0-remove`);
      fireEvent.click(removeAlert);

      expect(screen.queryByTestId(`${mockedAlertsTestid}-1-panel`)).not.toBeInTheDocument();
      expect(ref.current.getValues(`${mockedItemName}.alerts.1`)).toBeUndefined();
    });

    test(
      'Sets correct data when changed',
      async () => {
        const ref = renderSelectionRows(responseType);
        await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

        const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
        fireEvent.click(addAlert);

        const alertInput = screen
          .getByTestId(`${mockedAlertsTestid}-1-text`)
          .querySelector('input');
        fireEvent.change(alertInput, { target: { value: 'text' } });

        await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

        setAlertOption(1, 0);
        setAlertRow(1, 0);

        const alert = ref.current.getValues(`${mockedItemName}.alerts.1`);
        expect(alert).toStrictEqual({
          key: alert.key,
          alert: 'text',
          rowId: ref.current.getValues(`${mockedItemName}.responseValues.rows.0.id`),
          optionId: ref.current.getValues(`${mockedItemName}.responseValues.options.0.id`),
        });
      },
      JEST_TEST_TIMEOUT,
    );

    test('Options and Rows are filtered if already used', async () => {
      renderSelectionRows(responseType);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      setOption(2);

      const addRow = screen.getByTestId(mockedAddRowTestid);
      fireEvent.click(addRow);

      const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
      fireEvent.click(addAlert);
      fireEvent.click(addAlert);
      fireEvent.click(addAlert);

      setAlertOption(0, 0);
      setAlertRow(0, 0);

      setAlertRow(1, 0);

      const optionsSelect = screen
        .getByTestId(`${mockedAlertsTestid}-1-selection-per-row-option`)
        .querySelector('[role="button"]');
      fireEvent.mouseDown(optionsSelect);
      const filteredOptions = screen
        .getByTestId(`${mockedAlertsTestid}-1-selection-per-row-option-dropdown`)
        .querySelectorAll('li');
      expect(filteredOptions).toHaveLength(1);
      filteredOptions.forEach((option, index) => {
        expect(option).toHaveTextContent(`Option ${index + 2}`);
      });

      setAlertOption(1, 0);

      const rowsSelect = screen
        .getByTestId(`${mockedAlertsTestid}-2-selection-per-row-row`)
        .querySelector('[role="button"]');
      fireEvent.mouseDown(rowsSelect);
      const filteredRows = screen
        .getByTestId(`${mockedAlertsTestid}-2-selection-per-row-row-dropdown`)
        .querySelectorAll('li');
      expect(filteredRows).toHaveLength(1);
      filteredRows.forEach((row, index) => {
        expect(row).toHaveTextContent(`Row ${index + 2}`);
      });
    });

    test('Removes alerts if the last Alert was removed', async () => {
      const ref = renderSelectionRows(responseType);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const removeAlert = screen.getByTestId(`${mockedAlertsTestid}-0-remove`);
      fireEvent.click(removeAlert);

      expect(screen.queryByTestId(`${mockedAlertsTestid}-0-panel`)).not.toBeInTheDocument();
      expect(
        ref.current.getValues(`${mockedItemName}.config.${ItemConfigurationSettings.HasAlerts}`),
      ).toBeFalsy();
      expect(ref.current.getValues(`${mockedItemName}.alerts`)).toEqual([]);
    });
  });

  describe.each`
    responseType                                | description
    ${ItemResponseType.SingleSelectionPerRow}   | ${'Single: validations'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'Multi: validations'}
  `(
    '$description',
    ({ responseType }) => {
      test.each`
        testId                                                                           | message                        | description
        ${'builder-activity-items-item-configuration-selection-rows-option-0-text'}      | ${''}                          | ${'Option 1 text'}
        ${'builder-activity-items-item-configuration-selection-rows-option-1-text'}      | ${''}                          | ${'Option 2 text'}
        ${'builder-activity-items-item-configuration-selection-rows-option-2-text'}      | ${''}                          | ${'Option 3 text'}
        ${'builder-activity-items-item-configuration-selection-rows-row-0-text'}         | ${''}                          | ${'Row 1 text'}
        ${'builder-activity-items-item-configuration-selection-rows-row-1-text'}         | ${''}                          | ${'Row 2 text'}
        ${'builder-activity-items-item-configuration-alerts-0-selection-per-row-option'} | ${''}                          | ${'Alert Option'}
        ${'builder-activity-items-item-configuration-alerts-0-selection-per-row-row'}    | ${''}                          | ${'Alert Row'}
        ${'builder-activity-items-item-configuration-alerts-0-text'}                     | ${'Alert Message is required'} | ${'Alert Message'}
      `('$description', async ({ testId, message }) => {
        const ref = renderSelectionRows(responseType);
        await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

        const addRow = screen.getByTestId(mockedAddRowTestid);
        fireEvent.click(addRow);
        setOption(3);

        await ref.current.trigger(`${mockedItemName}`);

        await waitFor(() => {
          message && expect(screen.getByText(message)).toBeVisible();
          expect(screen.getByTestId(testId).querySelector('div')).toHaveClass('Mui-error');
        });
      });
    },
    JEST_TEST_TIMEOUT,
  );
});
