// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { getScreens } from './RespondentsRemoveAccessPopup.utils';

const mockScreensParams = {
  firstScreen: <div>First Screen</div>,
  secondScreen: <div>Second Screen</div>,
  thirdExtScreen: <div>Third Ext Screen</div>,
  respondentName: 'John Doe',
  appletName: 'Sample Applet',
  removeData: true,
  isRemoved: false,
  submitPassword: jest.fn(),
  removeAccess: jest.fn(),
  onClose: jest.fn(),
};

const expectedResult1 = [
  {
    buttonText: '',
    hasSecondBtn: false,
    title: 'removeFromApplet',
  },
  {
    buttonText: 'removeFromAppletAndData',
    hasSecondBtn: true,
    title: 'removeFromApplet',
    submitBtnColor: 'error',
  },
  {
    buttonText: 'submit',
    hasSecondBtn: true,
    title: 'enterAppletPassword',
  },
  {
    buttonText: 'yesRemove',
    hasSecondBtn: true,
    title: 'removeFromAppletAndData',
    submitBtnColor: 'error',
  },
  {
    buttonText: 'retry',
    hasSecondBtn: true,
    title: 'removeFromAppletAndData',
  },
];
const expectedResult2 = [
  {
    buttonText: '',
    hasSecondBtn: false,
    title: 'removeFromApplet',
  },
  {
    buttonText: 'removeFromApplet',
    hasSecondBtn: true,
    title: 'removeFromApplet',
    submitBtnColor: 'error',
  },
  {
    buttonText: 'yesRemove',
    hasSecondBtn: true,
    title: 'removeFromApplet',
    submitBtnColor: 'error',
  },
  {
    buttonText: 'ok',
    hasSecondBtn: false,
    title: 'removeFromApplet',
  },
];

const handleResultTest = (expected, result) =>
  expected.forEach(({ buttonText, hasSecondBtn, title, submitBtnColor }, index) => {
    expect(result[index].buttonText).toBe(buttonText);
    expect(result[index].hasSecondBtn).toBe(hasSecondBtn);
    expect(result[index].title).toBe(title);
    expect(result[index].submitBtnColor).toBe(submitBtnColor);
  });

describe('getScreens', () => {
  test('should return an array of screens when removeData is true', () => {
    const result = getScreens(mockScreensParams);

    expect(result).toHaveLength(5);
    handleResultTest(expectedResult1, result);
  });

  test('should return an array of screens when removeData is false and isRemoved true', () => {
    const result = getScreens({
      ...mockScreensParams,
      removeData: false,
      isRemoved: true,
    });

    expect(result).toHaveLength(4);
    handleResultTest(expectedResult2, result);
  });
});
