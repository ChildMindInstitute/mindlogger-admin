import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from 'react';

import { ResourceDataType } from './MediaUploader.types';

const MAX_FILE_SIZE = 8388608; // 8 MB

export type MediaUploaderProps = {
  setResourceData: (data: ResourceDataType | null) => void;
};
export const useMediaUploader = ({ setResourceData }: MediaUploaderProps) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetResource = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const isAllowableSize = file.size < MAX_FILE_SIZE;
    if (!isAllowableSize) {
      setError('audioExceedSize');

      return;
    }

    if (!file.type.includes('audio')) {
      setError('audioWrongFormat');

      return;
    }

    setError('');
    setResourceData({
      name: file.name,
      url: '',
      uploaded: false,
    });
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const dataUrl = reader.result;
      if (!dataUrl) return;

      setResourceData({
        name: file.name,
        url: dataUrl as string,
        uploaded: true,
      });
    };
  };

  const dragEvents = {
    onDragEnter: stopDefaults,
    onDragLeave: stopDefaults,
    onDragOver: stopDefaults,
    onDrop: (e: DragEvent<HTMLElement>) => {
      stopDefaults(e);
      const { files } = e.dataTransfer;

      handleSetResource(files);
    },
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    handleSetResource(files);
  };

  const onRemove = (/*e: MouseEvent*/) => {
    setResourceData(null);
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  };

  return {
    uploadInputRef,
    error,
    dragEvents,
    handleChange,
    onRemove,
  };
};
