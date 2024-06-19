import {Path, Svg, SvgProps} from "react-native-svg";

interface SVGAttributeProps extends SvgProps {
  width?: number;
  height?: number;
}
const HeartIcon = ({width, height, ...props}: SVGAttributeProps) => (
  <Svg width={width} height={height} {...props} viewBox="0 0 44 44">
    <Path
      opacity="0.5"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.8611 33.4528C9.71308 29.4855 3.66675 24.827 3.66675 16.7512C3.66675 7.83568 13.7501 1.51251 22.0001 10.0852V37.5833C20.1667 37.5833 18.3334 36.1717 16.4304 34.6683C15.9226 34.2687 15.3964 33.8653 14.8611 33.4528Z"
      fill="black"
    />
    <Path
      d="M27.5697 34.6683C32.9652 30.4187 40.3333 25.6667 40.3333 16.753C40.3333 7.83751 30.25 1.51434 22 10.087V37.5833C23.8333 37.5833 25.6667 36.1717 27.5697 34.6683Z"
      fill="black"
    />
  </Svg>
);
export default HeartIcon;
