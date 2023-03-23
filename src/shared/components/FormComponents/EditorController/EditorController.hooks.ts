import { MutableRefObject, useEffect, useState } from 'react';
import { ExposeParam } from 'md-editor-rt';

export const useTouchedTextarea = (editorRef: MutableRefObject<ExposeParam | undefined>) => {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const textarea = document.getElementById('md-editor-rt-textarea');
    if (!textarea) return;

    const onBlur = () => {
      setTouched(true);
    };
    textarea.addEventListener('blur', onBlur);

    return () => {
      textarea.removeEventListener('blur', onBlur);
    };
  }, [editorRef.current]);

  return {
    touched,
  };
};
