export const getScreens = (isUpload: boolean, components: JSX.Element[]) => [
  { component: components[0], btnText: 'import', hasSecondBtn: false },
  {
    component: components[1],
    btnText: 'ok',
    hasSecondBtn: false,
  },
  {
    component: components[2],
    btnText: 'retry',
    hasSecondBtn: true,
    secondBtnText: 'back',
  },
];

export const hasUploadedFileError = (
  array: Record<string, string | number>[],
  valuesArray: (string | number)[],
) => {
  if (array.length === 0) return true;

  const propertyCount = Object.keys(array[0]).length;

  for (const object of array) {
    if (Object.keys(object).length !== propertyCount) {
      return true;
    }

    for (const value of Object.values(object)) {
      if (!valuesArray.includes(value)) {
        return true;
      }
    }
  }

  return false;
};
