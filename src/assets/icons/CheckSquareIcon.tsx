import {ClipPath, Defs, G, Path, Rect, Svg, SvgProps} from "react-native-svg";

interface SVGAttributeProps extends SvgProps {
  width?: number;
  height?: number;
}

const CheckSquareIcon = ({width, height, ...props}: SVGAttributeProps) => (
  <Svg
    width={width}
    height={height}
    {...props}
    viewBox="0 0 16 16"
    fill="white">
    <G clipPath="url(#clip0_197_2621)">
      <Path
        d="M1.33337 7.99992C1.33337 4.85725 1.33337 3.28592 2.30937 2.30925C3.28671 1.33325 4.85737 1.33325 8.00004 1.33325C11.1427 1.33325 12.714 1.33325 13.69 2.30925C14.6667 3.28659 14.6667 4.85725 14.6667 7.99992C14.6667 11.1426 14.6667 12.7139 13.69 13.6899C12.7147 14.6666 11.1427 14.6666 8.00004 14.6666C4.85737 14.6666 3.28604 14.6666 2.30937 13.6899C1.33337 12.7146 1.33337 11.1426 1.33337 7.99992Z"
        stroke="#FFA34D"
        strokeWidth="1.5"
      />
      <Path
        d="M5.66675 8.33325L7.00008 9.66659L10.3334 6.33325"
        stroke="#FFA34D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_197_2621">
        <Rect width={width} height={height} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default CheckSquareIcon;
