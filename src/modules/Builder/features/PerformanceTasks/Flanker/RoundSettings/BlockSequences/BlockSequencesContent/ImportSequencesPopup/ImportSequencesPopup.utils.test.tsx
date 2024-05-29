import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { getScreens, getUploadedDataWithIds } from './ImportSequencesPopup.utils';

describe('getScreens', () => {
  const MockComponent1 = () => <div>Component 1</div>;
  const MockComponent2 = () => <div>Component 2</div>;
  const MockComponent3 = () => <div>Component 3</div>;

  const components = [
    <MockComponent1 key="1" />,
    <MockComponent2 key="2" />,
    <MockComponent3 key="3" />,
  ];

  test('should return the correct screen configurations', () => {
    const result = getScreens(true, components);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      component: components[0],
      btnText: 'import',
      hasSecondBtn: false,
    });
    expect(result[1]).toEqual({
      component: components[1],
      btnText: 'ok',
      hasSecondBtn: false,
    });
    expect(result[2]).toEqual({
      component: components[2],
      btnText: 'retry',
      hasSecondBtn: true,
      secondBtnText: 'back',
    });
  });

  test('should render the correct components', () => {
    const result = getScreens(true, components);

    result.forEach((screen, index) => {
      const { getByText } = renderWithProviders(screen.component);
      expect(getByText(`Component ${index + 1}`)).toBeInTheDocument();
    });
  });
});

describe('getUploadedDataWithIds', () => {
  test('should return invalidData when array is empty', () => {
    const uploadedImages = {};
    const result = getUploadedDataWithIds([], uploadedImages);
    expect(result).toEqual({ invalidData: true, uploadedDataWithIds: [] });
  });

  test('should return invalidData when objects in array have different property counts', () => {
    const array: Record<string, string | number>[] = [
      { key1: 'value1', key2: 'value2' },
      { key1: 'value1' },
    ];
    const uploadedImages = { value1: 'id1', value2: 'id2' };
    const result = getUploadedDataWithIds(array, uploadedImages);
    expect(result).toEqual({ invalidData: true, uploadedDataWithIds: [] });
  });

  test('should return invalidData when an image value is not in uploadedImages', () => {
    const array = [{ key1: 'value1', key2: 'value2' }];
    const uploadedImages = { value1: 'id1' };
    const result = getUploadedDataWithIds(array, uploadedImages);
    expect(result).toEqual({ invalidData: true, uploadedDataWithIds: [] });
  });

  test('should process data correctly when all values are valid', () => {
    const array = [
      { key1: 'value1', key2: 'value2' },
      { key1: 'value3', key2: 'value4' },
    ];
    const uploadedImages = { value1: 'id1', value2: 'id2', value3: 'id3', value4: 'id4' };
    const expected = {
      invalidData: false,
      uploadedDataWithIds: [
        {
          key1: { id: 'id1', text: 'value1' },
          key2: { id: 'id2', text: 'value2' },
        },
        {
          key1: { id: 'id3', text: 'value3' },
          key2: { id: 'id4', text: 'value4' },
        },
      ],
    };

    const result = getUploadedDataWithIds(array, uploadedImages);
    expect(result).toEqual(expected);
  });

  test('should handle non-string values in the array', () => {
    const array = [{ key1: 'value1', key2: 42 }];
    const uploadedImages = { value1: 'id1', '42': 'id42' };
    const expected = {
      invalidData: false,
      uploadedDataWithIds: [
        {
          key1: { id: 'id1', text: 'value1' },
          key2: { id: 'id42', text: '42' },
        },
      ],
    };

    const result = getUploadedDataWithIds(array, uploadedImages);
    expect(result).toEqual(expected);
  });
});
