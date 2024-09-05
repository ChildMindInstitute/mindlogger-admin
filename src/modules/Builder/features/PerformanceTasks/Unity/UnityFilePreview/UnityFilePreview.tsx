import React from 'react';

interface UnityFilePreviewProps {
  fileContent: string;
}

export const UnityFilePreview: React.FC<UnityFilePreviewProps> = ({ fileContent }) => (
  <textarea value={fileContent} readOnly style={{ width: '100%', height: '300px' }} />
);
