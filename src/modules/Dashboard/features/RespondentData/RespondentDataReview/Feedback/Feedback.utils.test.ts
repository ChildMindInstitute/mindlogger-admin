import { ItemResponseType } from 'shared/consts';

import { getDefaultValue } from './Feedback.utils';

describe('getDefaultValue', () => {
  it('should return null for ItemResponseType.Slider', () => {
    const result = getDefaultValue(ItemResponseType.Slider);
    expect(result).toBeNull();
  });

  it('should return an empty array for ItemResponseType.MultipleSelection', () => {
    const result = getDefaultValue(ItemResponseType.MultipleSelection);
    expect(result).toEqual([]);
  });

  it('should return an empty string for other response types', () => {
    const result = getDefaultValue(ItemResponseType.Text);
    expect(result).toBe('');
  });

  it('should return an empty string for an unknown response type', () => {
    const result = getDefaultValue(ItemResponseType.Message);
    expect(result).toBe('');
  });
});
