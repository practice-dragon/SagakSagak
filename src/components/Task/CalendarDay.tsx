import React from "react";
import styled, {useTheme} from "styled-components/native";
import Svg, {Circle as SvgCircle} from "react-native-svg";
import ActiveCheckIcon from "../../../src/assets/icons/ActiveCheckIcon";

interface CalendarDayProps {
  totalTasks?: number;
  completedTasks?: number;
  day: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 2px;
  width: 30px;
  background-color: transparent;
  margin: 0 4px;
  gap: 1px;
`;

const TaskStatusWrapper = styled.TouchableOpacity`
  margin: 2px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  position: relative;
`;

const DayText = styled.Text<{isSelected: boolean}>`
  font-size: ${({theme}) => theme.fonts.p3.fontSize}px;
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  color: ${({theme, isSelected}) =>
    isSelected ? theme.colors.primary : theme.colors.text};
`;

const CircleBox = styled.View`
  transform: rotate(-90deg);
`;
const StyledCircle = styled(SvgCircle)<{strokeColor: string}>`
  stroke: ${({strokeColor}) => strokeColor};
`;

const CalendarDay = ({
  totalTasks = 0,
  completedTasks = 0,
  day,
  isSelected = false,
  onClick,
}: CalendarDayProps) => {
  const theme = useTheme();
  const percentage =
    totalTasks > 0
      ? completedTasks === 0
        ? 0.05
        : completedTasks / totalTasks
      : 0;
  const radius = 10;
  const strokeWidth = 7;
  const diameter = radius * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage * circumference;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Wrapper>
      <TaskStatusWrapper onPress={handleClick}>
        <CircleBox>
          <Svg height={diameter + strokeWidth} width={diameter + strokeWidth}>
            <StyledCircle
              cx={(diameter + strokeWidth) / 2}
              cy={(diameter + strokeWidth) / 2}
              r={radius}
              strokeColor={theme.colors.n2}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <StyledCircle
              cx={(diameter + strokeWidth) / 2}
              cy={(diameter + strokeWidth) / 2}
              r={radius}
              strokeColor={theme.colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </Svg>
        </CircleBox>
        {completedTasks >= 1 && totalTasks === completedTasks ? (
          <ActiveCheckIcon
            width={24}
            height={24}
            style={{position: "absolute"}}
          />
        ) : null}
      </TaskStatusWrapper>
      <DayText isSelected={isSelected}>{day}</DayText>
    </Wrapper>
  );
};

export default CalendarDay;
