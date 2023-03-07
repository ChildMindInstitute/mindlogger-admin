import { useRef, useState } from 'react';
import { SourceLinkModalForm } from '../SourceLinkModal';

type UploadMethodsProps = {
  insertHandler: (values: SourceLinkModalForm) => void;
};
export const useUploadMethods = ({ insertHandler }: UploadMethodsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePopupSubmit = (formData: SourceLinkModalForm) => {
    setIsPopupVisible(false);
    insertHandler(formData);
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
    // @todo: add uploading logic
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
