import { GetComponentsProps, ModalType } from './LookupTable.types';
import { getModalComponents } from './LookupTable.utils';

describe('getModalComponents', () => {
  const defaultProps: Omit<GetComponentsProps, 'modalType'> = {
    columnData: [],
    data: [],
    error: null,
    warning: null,
    labelsObject: {
      upload: {
        title: 'Upload',
        initDescription: <>Upload file</>,
        successDescription: <>Success</>,
      },
      edit: {
        title: 'Edit',
        initDescription: <>Upload file</>,
        successDescription: <>Success</>,
      },
      delete: {
        title: 'Delete',
        initDescription: <>Upload file</>,
        successDescription: <>Success</>,
      },
      warnings: {
        incompleteSeverityData: 'Incomplete severity data',
      },
      errors: {
        incorrectFileFormat: <>Incorrect file format</>,
        fileCantBeParsed: <>File can't be parsed</>,
        haveToUploadFile: <>Have to upload file</>,
        onDelete: <>Delete</>,
      },
    },
    onFileReady: jest.fn(),
    onUpdate: jest.fn(),
    onClose: jest.fn(),
    onDownloadTemplate: jest.fn(),
    setModalType: jest.fn(),
    setStep: jest.fn(),
    setError: jest.fn(),
  };

  it('should return correct components for Upload modal', () => {
    const components = getModalComponents({
      ...defaultProps,
      modalType: ModalType.Upload,
    });

    expect(components).toHaveLength(2);

    const [init, success] = components;

    expect(init).toMatchObject({
      title: 'Upload',
      buttonText: 'Save',
      onSubmit: expect.any(Function),
      hasSecondBtn: true,
      secondBtnText: 'Cancel',
      onSecondBtnSubmit: defaultProps.onClose,
    });

    expect(success).toMatchObject({
      title: 'Upload',
      buttonText: 'Save',
      onSubmit: expect.any(Function),
      hasSecondBtn: true,
      secondBtnText: 'Cancel',
      onSecondBtnSubmit: defaultProps.onClose,
    });
  });

  it('should return correct components for Edit modal', () => {
    const components = getModalComponents({
      ...defaultProps,
      modalType: ModalType.Edit,
    });

    expect(components).toHaveLength(1);

    const [init] = components;

    expect(init).toMatchObject({
      title: 'Edit',
      buttonText: 'Replace',
      onSubmit: expect.any(Function),
      hasSecondBtn: true,
      secondBtnText: 'Delete',
      onSecondBtnSubmit: expect.any(Function),
      hasThirdBtn: true,
      thirdBtnText: 'Cancel',
      onThirdBtnSubmit: defaultProps.onClose,
    });
  });

  it('should return correct components for Delete modal', () => {
    const components = getModalComponents({
      ...defaultProps,
      modalType: ModalType.Delete,
    });

    expect(components).toHaveLength(2);

    const [init, success] = components;

    expect(init).toMatchObject({
      title: 'Delete',
      buttonText: 'Delete',
      onSubmit: expect.any(Function),
      hasSecondBtn: true,
      secondBtnText: 'Cancel',
      onSecondBtnSubmit: defaultProps.onClose,
    });

    expect(success).toMatchObject({
      title: 'Delete',
      buttonText: 'Ok',
      onSubmit: defaultProps.onClose,
    });
  });
});
