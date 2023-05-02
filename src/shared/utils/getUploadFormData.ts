export const getUploadFormData = (file: File) => {
  const body = new FormData();
  body.append('file', file);

  return body;
};
