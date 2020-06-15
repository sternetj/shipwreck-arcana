import { useState } from "react";
import { onLongPress } from "../../../../services/long-press";

export const useLongPress = (
  handler: Function = () => {},
  enabled: boolean = true,
) => {
  const [longPress, setLongPress] = useState(onLongPress(handler));
  const functionsSet = !!longPress.onTouchEnd;

  if (!enabled && functionsSet) {
    longPress.onTouchEnd();
    setLongPress({
      onTouchEnd: undefined as any,
      onTouchStart: undefined as any,
    });
  } else if (enabled && !functionsSet) {
    setLongPress(onLongPress(handler));
  }

  return longPress;
};
