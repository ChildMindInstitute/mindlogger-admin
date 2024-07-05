import { useRef, useState, useEffect } from 'react';

import { MediaType } from 'shared/consts';
import { useMediaUpload } from 'shared/hooks/useMediaUpload';
import { getMediaName } from 'shared/utils/getMediaName';
import { TargetExtension } from 'shared/api';

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
  const { executeMediaUpload, isLoading } = useMediaUpload({
    callback: (address) => {
      const label = getMediaName(address);

      insertHandler({
        label,
        address,
      });
    },
    finallyCallback: () => {
      inputRef.current = null;
    },
  });
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

  const onInputChange = (targetExtension?: TargetExtension) => {
    if (!inputRef.current?.files?.length) return;

    const file = inputRef.current.files[0];
    if (file.size >= fileSizeExceeded) {
      return setFileSizeExceeded(fileSizeExceeded);
    }

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    const validFileExtensions = type ? validFileExtensionsByType[type] : [];
    if (!validFileExtensions.includes(`.${fileExtension}`)) {
      return setIncorrectFormat(type);
    }

    executeMediaUpload({ file, fileName, targetExtension });
  };

  useEffect(() => {
    setIsLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
