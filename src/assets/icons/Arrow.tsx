import React from "react";
import {Path, Svg, SvgProps} from "react-native-svg";

interface SVGAttributeProps extends SvgProps {
  width?: number;
  height?: number;
  direction?: "up" | "down" | "left" | "right";
}

const getRotation = (direction: "up" | "down" | "left" | "right") => {
  switch (direction) {
    case "up":
      return "rotate(-90 22.5 22.5)";
    case "down":
      return "rotate(90 22.5 22.5)";
    case "left":
      return "rotate(180 22.5 22.5)";
    case "right":
    default:
      return "rotate(0 22.5 22.5)";
  }
};

const Arrow = ({
  width,
  height,
  direction = "right",
  ...props
}: SVGAttributeProps) => {
  const rotation = getRotation(direction);
  return (
    <Svg width={width} height={height} viewBox="0 0 45 45" {...props}>
      <Path
        d="M29.6906 23.1938L17.2594 35.2501C16.4812 36.002 15 35.5463 15 34.5563V10.4438C15 9.45384 16.4812 8.99822 17.2594 9.75009L29.6906 21.8063C29.7878 21.8939 29.8655 22.0009 29.9187 22.1204C29.9719 22.2399 29.9994 22.3693 29.9994 22.5001C29.9994 22.6309 29.9719 22.7603 29.9187 22.8798C29.8655 22.9993 29.7878 23.1063 29.6906 23.1938Z"
        fill="black"
        transform={rotation}
      />
    </Svg>
  );
};

export default Arrow;
