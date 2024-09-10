import React from 'react';

interface UnityFilePreviewProps {
  fileContent: string;
}

/* TODO - Refactor UnityFilePreview component to add the possibility of editing the Unity file
 * into the Builder. Tasks https://mindlogger.atlassian.net/browse/M2-7778 and https://mindlogger.atlassian.net/browse/M2-7779   */
export const UnityFilePreview: React.FC<UnityFilePreviewProps> = ({ fileContent }) => (
  <textarea value={fileContent} readOnly style={{ width: '100%', height: '300px' }} />
);
