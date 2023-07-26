import { useRef, useState } from 'react';

import { postFileUploadApi } from 'api';
import { useAsync } from 'shared/hooks';
import { falseReturnFunc, getUploadFormData } from 'shared/utils';
import { VALID_IMAGE_TYPES } from 'shared/consts';

import { SourceLinkModalForm } from '../SourceLinkModal';
import { MediaType, UploadMethodsProps } from './Extensions.types';
import { checkImgUrl } from './Extensions.utils';

export const useUploadMethods = ({
  insertHandler,
  setFileSizeExceeded,
  fileSizeExceeded,
  setIncorrectImageFormat,
  type,
}: UploadMethodsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { execute: executeImgUpload } = useAsync(
    postFileUploadApi,
    (response) => {
      const file = inputRef.current?.files?.[0];

      response?.data?.result &&
        insertHandler({
          label: file?.name ?? '',
          address: response?.data?.result.url ?? '',
        });
    },
    falseReturnFunc,
    () => {
      inputRef.current = null;
    },
  );
  const [sourceError, setSourceError] = useState('');

  const handlePopupSubmit = async (formData: SourceLinkModalForm) => {
    if (type === MediaType.Image) {
      const isImgUrl = await checkImgUrl(formData.address);
      if (!isImgUrl) {
        setSourceError('invalidLink');

        return;
      }
    }

    setSourceError('');
    setIsPopupVisible(false);
    insertHandler(formData);
  };

  const handlePopupClose = () => {
    setSourceError('');
    setIsPopupVisible(false);
  };

  const onAddLinkClick = () => {
    setIsPopupVisible(true);
  };

  const onUploadClick = () => {
    inputRef.current?.click();
  };

  const onInputChange = () => {
    if (!inputRef.current?.files?.length) return;

    const file = inputRef.current.files[0];
    if (file.size > fileSizeExceeded) {
      return setFileSizeExceeded(fileSizeExceeded);
    }

    if (setIncorrectImageFormat && file.type.includes('image')) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!VALID_IMAGE_TYPES.includes(`.${fileExtension}`)) {
        return setIncorrectImageFormat(true);
      }
    }

    const body = getUploadFormData(file);
    executeImgUpload(body);
  };

  return {
    inputRef,
    isVisible,
    setIsVisible,
    isPopupVisible,
    sourceError,
    handlePopupSubmit,
    handlePopupClose,
    onAddLinkClick,
    onUploadClick,
    onInputChange,
  };
};
