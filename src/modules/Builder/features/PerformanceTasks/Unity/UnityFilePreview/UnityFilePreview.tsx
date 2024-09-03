import React, { useState, useEffect } from 'react';

interface UnityFilePreviewProps {
  file: File | null;
}

export const UnityFilePreview: React.FC<UnityFilePreviewProps> = ({ file }) => {
  const [fileContent, setFileContent] = useState<string>('');

  useEffect(() => {
    if (file === null) {
      setFileContent('');

      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target?.result as string);
    };
    reader.readAsText(file);
  }, [file]);

  return <textarea value={fileContent} readOnly style={{ width: '100%', height: '300px' }} />;
};
