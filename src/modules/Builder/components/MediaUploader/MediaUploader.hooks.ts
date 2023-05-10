import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from 'react';

import { MAX_FILE_SIZE_8MB } from 'shared/consts';
import { useAsync } from 'shared/hooks';
import { getUploadFormData } from 'shared/utils';
import { postFileUploadApi } from 'api';

import { MediaUploaderHookProps } from './MediaUploader.types';

export const useMediaUploader = ({ onUpload }: MediaUploaderHookProps) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const { execute: executeMediaUpload } = useAsync(postFileUploadApi, (response) => {
    const name = response?.config?.data?.get('file')?.name;

    return (
      response?.data?.result &&
      onUpload({ name, url: response?.data?.result.url ?? '', uploaded: true })
    );
  });

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetResource = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const isAllowableSize = file.size < MAX_FILE_SIZE_8MB;
    if (!isAllowableSize) {
      setError('audioExceedSize');

      return;
    }

    if (!file.type.includes('audio')) {
      setError('audioWrongFormat');

      return;
    }

    setError('');

    const body = getUploadFormData(file);

    onUpload({ name: file.name, uploaded: false });
    executeMediaUpload(body);
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
    onUpload(null);
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
