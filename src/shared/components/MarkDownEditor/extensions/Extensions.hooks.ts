import { useRef, useState, useEffect } from 'react';

import { postFileUploadApi } from 'api';
import { useAsync } from 'shared/hooks';
import { falseReturnFunc } from 'shared/utils/func';
import { getUploadFormData } from 'shared/utils/getUploadFormData';
import { MediaType } from 'shared/consts';

import { SourceLinkModalForm } from '../SourceLinkModal';
import { UploadMethodsProps } from './Extensions.types';
import { checkImgUrl } from './Extensions.utils';
import { validFileExtensionsByType } from './Extensions.const';

export const useUploadMethods = ({
  insertHandler,
  setFileSizeExceeded,
  fileSizeExceeded,
  setIncorrectFormat,
  type,
  setIsLoading,
}: UploadMethodsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { execute: executeMediaUpload, isLoading } = useAsync(
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

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validFileExtensions = type ? validFileExtensionsByType[type] : [];
    if (!validFileExtensions.includes(`.${fileExtension}`)) {
      return setIncorrectFormat(type);
    }

    const body = getUploadFormData(file);
    executeMediaUpload(body);
  };

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

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
