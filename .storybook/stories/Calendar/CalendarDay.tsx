import React from "react";
import styled from "styled-components/native";
import Svg, {Circle as SvgCircle} from "react-native-svg";

interface CalendarDayProps {
  totalTasks?: number;
  completedTasks?: number;
  day: number;
  isSelected?: boolean;
  isCompleted?: boolean;
}

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 2px;
  width: 30px;
  height: 40px;
  background-color: transparent;
  margin: 4px;
`;

const TaskStatusWrapper = styled.View`
  margin: 2px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  position: relative;
`;

const DayText = styled.Text<{isSelected: boolean}>`
  font-size: ${({theme}) => theme.fonts.p3.fontSize};
  font-family: ${({theme}) => theme.fonts.p3.fontFamily};
  color: ${({theme, isSelected}) =>
    isSelected ? theme.colors.primary : theme.colors.text};
`;

const StyledCircle = styled(SvgCircle)<{strokeColor: string}>`
  stroke: ${({strokeColor}) => strokeColor};
`;

const CalendarDay = ({
  totalTasks = 0,
  completedTasks = 0,
  day,
  isSelected = false,
  isCompleted = false,
}: CalendarDayProps) => {
  const percentage = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const radius = 10;
  const strokeWidth = 3;
  const diameter = radius * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <Wrapper>
      <TaskStatusWrapper>
        <Svg height={diameter + strokeWidth} width={diameter + strokeWidth}>
          <StyledCircle
            cx={(diameter + strokeWidth) / 2}
            cy={(diameter + strokeWidth) / 2}
            r={radius}
            strokeColor={({theme}) => theme.colors.primary}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <StyledCircle
            cx={(diameter + strokeWidth) / 2}
            cy={(diameter + strokeWidth) / 2}
            r={radius}
            strokeColor={({theme}) => theme.colors.n2}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
      </TaskStatusWrapper>
      <DayText isSelected={isSelected}>{day}</DayText>
    </Wrapper>
  );
};

export default CalendarDay;
