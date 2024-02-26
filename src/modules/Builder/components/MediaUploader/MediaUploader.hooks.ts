import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from 'react';

import { AudioFileFormats, MAX_FILE_SIZE_150MB, VALID_AUDIO_FILE_TYPES } from 'shared/consts';
import { useMediaUpload } from 'shared/hooks/useMediaUpload';
import { getMediaName } from 'shared/utils/getMediaName';

import { MediaUploaderHookProps } from './MediaUploader.types';

export const useMediaUploader = ({ onUpload }: MediaUploaderHookProps) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const { executeMediaUpload, error: uploadError } = useMediaUpload({
    callback: (url) => {
      const name = getMediaName(url);

      console.log('uploaded true');

      return onUpload({ name, url, uploaded: true });
    },
  });

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetResource = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const isAllowableSize = file.size < MAX_FILE_SIZE_150MB;
    if (!isAllowableSize) {
      setError('audioExceedSize');

      return;
    }

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    if (!VALID_AUDIO_FILE_TYPES.includes(`.${fileExtension}` as AudioFileFormats)) {
      setError('audioWrongFormat');

      return;
    }

    setError('');
    onUpload({ name: fileName, uploaded: false });
    executeMediaUpload({ file, fileName });
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

  const onRemove = () => {
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
    uploadError,
  };
};
