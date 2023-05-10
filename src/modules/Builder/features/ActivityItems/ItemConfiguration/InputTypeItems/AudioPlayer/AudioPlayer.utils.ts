export const getNameByUrl = (url?: string) => {
  if (!url) return;

  const paths = url.split('/');

  return paths[paths.length - 1];
};
