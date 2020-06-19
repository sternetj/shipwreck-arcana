import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import ReactDOM from "react-dom";

const defaultBorderColor = "#0f0";
const defaultBorderStyle = "solid";
const defaultBorderWidth = 1;

interface LineProps {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  zIndex?: number;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  className?: string;
}

export const Line: React.FC<LineProps> = (props) => {
  const { x0, y0, x1, y1, zIndex, className = "" } = props;
  const { borderColor, borderStyle, borderWidth } = props;

  const dy = y1 - y0;
  const dx = x1 - x0;

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy);

  const positionStyle = {
    position: "absolute",
    top: `${y0}px`,
    left: `${x0}px`,
    width: `${length}px`,
    zIndex: Number.isFinite(zIndex!) ? String(zIndex) : "1",
    transform: `rotate(${angle}deg)`,
    // Rotate around (x0, y0)
    transformOrigin: "0 0",
  };

  const defaultStyle = {
    borderTopColor: borderColor || defaultBorderColor,
    borderTopStyle: borderStyle || defaultBorderStyle,
    borderTopWidth: borderWidth || defaultBorderWidth,
  };

  const lineProps = {
    className: className,
    style: Object.assign({}, defaultStyle, positionStyle),
  };

  return ReactDOM.createPortal(<div {...(lineProps as any)} />, document.body);
};

type SteppedLineProps = Omit<LineProps, "x0" | "y0" | "x1" | "y1"> & {
  from: string;
  to: string;
};

export const SteppedLineTo: React.FC<SteppedLineProps> = (props) => {
  const { from, to, ...lineProps } = props;
  const { borderWidth = 0 } = lineProps;

  const { x: x0, y: y0 } = useAnchor(from);
  const { x: x1, y: y1 } = useAnchor(to);

  if ((!x0 && !y0) || (!x1 && !y1)) return null;

  return (
    <>
      <Line {...lineProps} x0={x0} y0={y0} x1={x0} y1={y1 + 20 + borderWidth} />
      <Line {...lineProps} x0={x0} y0={y1 + 20} x1={x1} y1={y1 + 20} />
      <Line {...lineProps} x0={x1} y0={y1 + 20 + borderWidth} x1={x1} y1={y1} />
    </>
  );
};

const useAnchor = (className: string) => {
  const [state, setState] = useState({ x: 0, y: 0 });
  const [el, setElement] = useState<Element | undefined>(
    document.getElementsByClassName(className)[0],
  );

  const update = useCallback(() => {
    setElement(undefined);
    setTimeout(() => {
      const el = document.getElementsByClassName(className)[0];
      setElement(el);
    });
  }, [className]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [update]);

  useLayoutEffect(() => {
    const anchor = { x: 0.5, y: 1 };
    const box = el?.getBoundingClientRect();

    if (!box) return;
    const { left, top, width, height } = box || {};

    if (!width || !height) return update();

    let offsetX = window.pageXOffset;
    let offsetY = window.pageYOffset;

    const x = left + width * anchor.x + offsetX;
    const y = top + height * anchor.y + offsetY;

    setState({ x, y });
  }, [el, update]);

  return state;
};
