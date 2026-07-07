export const navigateWithDelay = (
  navigate: (path: string) => void,
  path: string,
  delay: number = 800,
) => {
  setTimeout(() => {
    navigate(path);
  }, delay);
};
