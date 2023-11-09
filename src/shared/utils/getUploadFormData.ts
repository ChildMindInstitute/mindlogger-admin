export const getUploadFormData = (file: File | Blob) => {
  const body = new FormData();
  body.append('file', file);

  return body;
};
