import {Path, Svg, SvgProps} from "react-native-svg";

interface SVGAttributeProps extends SvgProps {
  width?: number;
  height?: number;
}

const MenuDotsIcon = ({width, height, ...props}: SVGAttributeProps) => (
  <Svg width={width} height={height} {...props} viewBox="0 0 45 45">
    <Path
      d="M31.5 23.0625C31.5 22.3166 31.7963 21.6012 32.3238 21.0738C32.8512 20.5463 33.5666 20.25 34.3125 20.25C35.0584 20.25 35.7738 20.5463 36.3012 21.0738C36.8287 21.6012 37.125 22.3166 37.125 23.0625C37.125 23.8084 36.8287 24.5238 36.3012 25.0512C35.7738 25.5787 35.0584 25.875 34.3125 25.875C33.5666 25.875 32.8512 25.5787 32.3238 25.0512C31.7963 24.5238 31.5 23.8084 31.5 23.0625ZM20.25 23.0625C20.25 22.3166 20.5463 21.6012 21.0738 21.0738C21.6012 20.5463 22.3166 20.25 23.0625 20.25C23.8084 20.25 24.5238 20.5463 25.0512 21.0738C25.5787 21.6012 25.875 22.3166 25.875 23.0625C25.875 23.8084 25.5787 24.5238 25.0512 25.0512C24.5238 25.5787 23.8084 25.875 23.0625 25.875C22.3166 25.875 21.6012 25.5787 21.0738 25.0512C20.5463 24.5238 20.25 23.8084 20.25 23.0625ZM9 23.0625C9 22.3166 9.29632 21.6012 9.82376 21.0738C10.3512 20.5463 11.0666 20.25 11.8125 20.25C12.5584 20.25 13.2738 20.5463 13.8012 21.0738C14.3287 21.6012 14.625 22.3166 14.625 23.0625C14.625 23.8084 14.3287 24.5238 13.8012 25.0512C13.2738 25.5787 12.5584 25.875 11.8125 25.875C11.0666 25.875 10.3512 25.5787 9.82376 25.0512C9.29632 24.5238 9 23.8084 9 23.0625Z"
      fill="black"
    />
  </Svg>
);

export default MenuDotsIcon;