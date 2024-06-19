import {Path, Svg, SvgProps} from "react-native-svg";

interface SVGAttributeProps extends SvgProps {
  width?: number;
  height?: number;
}

const ActiveHeartIcon = ({width, height, ...props}: SVGAttributeProps) => (
  <Svg width={width} height={height} {...props} viewBox="0 0 42 42">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.1855 31.9323C9.2715 28.1453 3.5 23.6986 3.5 15.9898C3.5 7.47956 13.125 1.44381 21 9.62681V35.8751C19.25 35.8751 17.5 34.5276 15.6835 33.0926C15.1987 32.7111 14.6965 32.3261 14.1855 31.9323Z"
      fill="#FFA34D"
    />
    <Path
      d="M26.3165 33.0925C31.4668 29.036 38.5 24.5 38.5 15.9915C38.5 7.48127 28.875 1.44552 21 9.62852V35.875C22.75 35.875 24.5 34.5275 26.3165 33.0925Z"
      fill="#FF7A00"
    />
  </Svg>
);
export default ActiveHeartIcon;
