import { getButtonLabel } from './ButtonsContent.utils';

describe('getButtonLabel', () => {
  test('should return the correct label for a single button', () => {
    const buttonsQuantity = 1;
    const buttonIndex = 0;
    const expectedLabel = 'Button Name';

    const label = getButtonLabel(buttonsQuantity, buttonIndex);

    expect(label).toBe(expectedLabel);
  });

  test('should return the correct label for the left button', () => {
    const buttonsQuantity = 2;
    const buttonIndex = 0;
    const expectedLabel = 'Left Button Name';

    const label = getButtonLabel(buttonsQuantity, buttonIndex);

    expect(label).toBe(expectedLabel);
  });

  test('should return the correct label for the right button', () => {
    const buttonsQuantity = 2;
    const buttonIndex = 1;
    const expectedLabel = 'Right Button Name';

    const label = getButtonLabel(buttonsQuantity, buttonIndex);

    expect(label).toBe(expectedLabel);
  });
});
