
export const Haptics = {
  light: () => {
    if ('vibrate' in navigator) navigator.vibrate(40);
  },
  medium: () => {
    if ('vibrate' in navigator) navigator.vibrate(70);
  },
  heavy: () => {
    if ('vibrate' in navigator) navigator.vibrate([150]);
  },
  error: () => {
    if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
  },
  success: () => {
    if ('vibrate' in navigator) navigator.vibrate([40, 30, 40]);
  }
};
