export const asyncTimeout = async (delay: number) =>
  await new Promise((resolve) => setTimeout(resolve, delay));
