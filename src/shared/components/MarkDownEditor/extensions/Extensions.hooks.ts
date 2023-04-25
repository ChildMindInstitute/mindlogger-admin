import { useRef, useState } from 'react';

import { postFileUploadApi } from 'api';
import { useAsync } from 'shared/hooks';
import { getUploadFormData } from 'shared/utils';

import { SourceLinkModalForm } from '../SourceLinkModal';
import { UploadMethodsProps } from './Extensions.types';

export const useUploadMethods = ({ insertHandler }: UploadMethodsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { execute: executeImgUpload } = useAsync(
    postFileUploadApi,
    // TODO: check field name (url, key or other), check insertHandler
    (response) => response?.data?.result && insertHandler({ imgLink: response?.data?.result.url }),
  );

  const handlePopupSubmit = (formData: SourceLinkModalForm) => {
    setIsPopupVisible(false);
    insertHandler({ values: formData });
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  const onAddLinkClick = () => {
    setIsPopupVisible(true);
  };

  const onUploadClick = () => {
    inputRef.current?.click();
  };

  const onInputChange = () => {
    if (inputRef.current?.files) {
      const imageFile = inputRef.current.files[0];
      const body = getUploadFormData(imageFile);
      executeImgUpload(body);
    }
  };

  return {
    inputRef,
    isVisible,
    setIsVisible,
    isPopupVisible,
    handlePopupSubmit,
    handlePopupClose,
    onAddLinkClick,
    onUploadClick,
    onInputChange,
  };
};
