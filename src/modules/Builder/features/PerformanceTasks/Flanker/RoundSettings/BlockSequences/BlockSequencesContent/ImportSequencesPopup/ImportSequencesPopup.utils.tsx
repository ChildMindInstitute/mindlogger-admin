import { UploadedData, UploadedRecord } from '../BlockSequencesContent.types';
import { UploadedImages } from './ImportSequencesPopup.types';

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

export const getUploadedDataWithIds = (array: Record<string, string | number>[], uploadedImages: UploadedImages) => {
  const invalidDataReturn = { invalidData: true, uploadedDataWithIds: [] };

  if (array.length === 0) return invalidDataReturn;

  const propertyCount = Object.keys(array[0]).length;
  const uploadedDataWithIds: UploadedData = [];

  for (const object of array) {
    if (Object.keys(object).length !== propertyCount) {
      return invalidDataReturn;
    }

    const dataWithIds: UploadedRecord = {};

    for (const [key, value] of Object.entries(object)) {
      if (!Object.keys(uploadedImages).includes(String(value))) {
        return invalidDataReturn;
      }

      if (!dataWithIds[key]) {
        dataWithIds[key] = {} as { id: string; text: string };
      }

      dataWithIds[key].id = uploadedImages[String(value)];
      dataWithIds[key].text = String(value);
    }

    uploadedDataWithIds.push(dataWithIds);
  }

  return { invalidData: false, uploadedDataWithIds };
};
