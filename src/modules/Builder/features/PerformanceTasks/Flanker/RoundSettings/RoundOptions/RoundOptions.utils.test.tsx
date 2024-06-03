import { getCheckboxes } from './RoundOptions.utils';

describe('getCheckboxes', () => {
  test('renders checkboxes with correct labels', () => {
    const checkboxes = getCheckboxes({ fieldName: 'exampleField', 'data-testid': 'exampleTestId' });

    expect(checkboxes).toHaveLength(2);

    expect(checkboxes[0].name).toEqual('exampleField.showFeedback');
    expect(checkboxes[0]['data-testid']).toEqual('exampleTestId-show-feedback');

    expect(checkboxes[1].name).toEqual('exampleField.showResults');
    expect(checkboxes[1]['data-testid']).toEqual('exampleTestId-show-summary');
  });
});
