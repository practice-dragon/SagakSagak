import React, {useState} from "react";
import styled, {useTheme} from "styled-components/native";
import CalendarDay from "./CalendarDay";
import ArrowIcon from "../../../src/assets/icons/ArrowIcon";
const Container = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  width: 90%;
`;

const DateContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const DateText = styled.Text`
  font-size: ${({theme}) => theme.fonts.h3.fontSize};
  font-family: ${({theme}) => theme.fonts.h3.fontFamily};
  color: ${({theme}) => theme.colors.text};
  text-align: center;
`;

const CalendarDayContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const WeekdayContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
  width: 100%;
  justify-content: space-between;
`;

const WeekdayText = styled.Text`
  font-size: 12px;
  color: #666;
  box-sizing: border-box;
  padding: 2px;
  width: 30px;
  margin: 0 4px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

const Button = styled.TouchableOpacity`
  padding: 8px;
`;

const CalendarWeek = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const theme = useTheme();

  const handlePreviousWeek = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7,
      ),
    );
  };

  const handleNextWeek = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 7,
      ),
    );
  };

  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <Container>
      <ButtonContainer>
        <Button onPress={handlePreviousWeek}>
          <ArrowIcon width={24} height={24} direction="left" />
        </Button>
        <DateContainer>
          <DateText>
            {currentDate.toLocaleString("ko-KR", {month: "short"})}{" "}
            {currentDate.getDate()}일
          </DateText>
        </DateContainer>
        <Button onPress={handleNextWeek}>
          <ArrowIcon width={24} height={24} direction="right" />
        </Button>
      </ButtonContainer>
      <WeekdayContainer>
        {weekdays.map((weekday, index) => (
          <WeekdayText key={index}>{weekday}</WeekdayText>
        ))}
      </WeekdayContainer>
      <CalendarDayContainer>
        <CalendarDay
          day={1}
          completedTasks={2}
          isSelected={false}
          totalTasks={3}
        />
        <CalendarDay
          day={2}
          completedTasks={2}
          isSelected={false}
          totalTasks={0}
        />
        <CalendarDay
          day={3}
          completedTasks={2}
          isSelected={false}
          totalTasks={0}
        />
        <CalendarDay
          day={4}
          completedTasks={2}
          isSelected={false}
          totalTasks={0}
        />
        <CalendarDay
          day={5}
          completedTasks={2}
          isSelected={false}
          totalTasks={0}
        />
        <CalendarDay
          day={6}
          completedTasks={2}
          isSelected={false}
          totalTasks={0}
        />
        <CalendarDay
          day={7}
          completedTasks={2}
          isSelected={false}
          totalTasks={0}
        />
      </CalendarDayContainer>
    </Container>
  );
};

export default CalendarWeek;
