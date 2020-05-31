export const onLongPress = (handler: Function) => {
  let timerId: number;
  const onTouchStart = () => {
    timerId = setTimeout(handler, 500);
  };
  const onTouchEnd = () => {
    clearTimeout(timerId);
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
};
